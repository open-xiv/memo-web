import { getDutyByID, getDutyNameByID, getMemberZoneBestProgress, getMemberZoneLatestProgresses } from "@/api/sumemo.ts";
import type { Fight, Player } from "@/types/fight.ts";
import { useEffect, useMemo, useState } from "react";
import FightCard from "@/components/custom/fight/card/FightCard.tsx";
import type { Duty } from "@/types/duty.ts";
import { BarZone } from "@/components/custom/bar/BarZone.tsx";
import { BarLoading } from "@/components/custom/bar/BarLoading.tsx";
import { BarLogsNav } from "@/components/custom/bar/BarLogsNav.tsx";
import { getJobIconByID, sortPlayersInFight } from "@/lib/job.ts";
import { Link } from "react-router-dom";
import {cn} from "@/lib/utils.ts";
import { Crown } from "lucide-react";


interface ZoneProgressRowProps {
    zoneID: number,
    memberName: string,
    memberServer: string,
}

export default function FightDuty({ zoneID, memberName, memberServer }: ZoneProgressRowProps) {
    const [bestFight, setBestFight] = useState<Fight | null>(null);

    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [expandLatest, setExpandLatest] = useState<"min" | "max">("min");
    const [limit, setLimit] = useState<number>(20);

    const [dutyName, setDutyName] = useState<string | null>(null);
    const [duty, setDuty] = useState<Duty | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const groupedLatestFights = useMemo(() => {
        if (expandLatest !== "max") return [];

        const fightsToGroup = latestFights;
        const groups: {
            id: string;
            players: Player[];
            fights: Fight[];
            totalDeaths: Record<string, number>;
            bestProgress: string;
            minHP: number;
        }[] = [];

        const keyToGroupIndex = new Map<string, number>();

        fightsToGroup.forEach(fight => {
            const sortedFight = sortPlayersInFight(fight);
            const key = sortedFight.players.map(p => `${p.name}@${p.server}`).join("|");

            let groupIndex = keyToGroupIndex.get(key);
            if (groupIndex === undefined) {
                groups.push({
                    id: key,
                    players: sortedFight.players,
                    fights: [],
                    totalDeaths: {},
                    bestProgress: fight.progress.phase && fight.progress.phase !== "N/A" ? fight.progress.phase : "",
                    minHP: fight.progress.enemy_hp || 100
                });
                groupIndex = groups.length - 1;
                keyToGroupIndex.set(key, groupIndex);

                sortedFight.players.forEach(p => {
                    groups[groupIndex!].totalDeaths[`${p.name}@${p.server}`] = 0;
                });
            }

            const group = groups[groupIndex];
            group.fights.push(fight);

            // Update best progress logic
            if (fight.clear) {
                group.bestProgress = "已完成";
                group.minHP = 0;
            } else {
                // If we have a phase, and it's different from current (assuming later phases are longer/better strings, or we'd need a phase order map)
                if (fight.progress.phase && fight.progress.phase !== "N/A" && (!group.bestProgress || group.bestProgress === "N/A" || group.bestProgress !== "已击杀")) {
                    group.bestProgress = fight.progress.phase;
                }
                // Always track minimum HP
                if (fight.progress.enemy_hp !== undefined && fight.progress.enemy_hp < group.minHP) {
                    group.minHP = fight.progress.enemy_hp;
                }
            }

            fight.players.forEach(p => {
                const pKey = `${p.name}@${p.server}`;
                if (group.totalDeaths[pKey] !== undefined) {
                    group.totalDeaths[pKey] += p.death_count;
                }
            });
        });

        return groups;
    }, [latestFights, expandLatest]);

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const dutyData = await getDutyByID(zoneID);
                setDuty(dutyData);
            } catch (error) {
                console.error("Error fetching zone data:", error);
                setDuty(null);
            }
        };

        void fetchZone();
    }, [zoneID]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const dutyName = await getDutyNameByID(zoneID);
                setDutyName(dutyName);

                const [bestProgress, latestProgresses] = await Promise.all([
                    getMemberZoneBestProgress(memberName, memberServer, zoneID),
                    getMemberZoneLatestProgresses(memberName, memberServer, zoneID, limit),
                ]);

                setBestFight(bestProgress?.fight || null);

                setLatestFights(
                        latestProgresses
                                .map(p => p.fight)
                                .filter((f): f is Fight => f !== null)
                                .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()),
                );

            } catch (err) {
                console.error(`failed to fetch progress for zone ${zoneID}:`, err);
                setBestFight(null);
                setLatestFights([]);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [zoneID, memberName, memberServer, limit]);

    if (isLoading) {
        return (
                <BarLoading message={`数据加载中`} />
        );
    }


    function fightContent() {
        if (!bestFight && latestFights.length === 0 && duty && duty.logs_encounter) {
            return (
                    <BarLogsNav memberName={memberName} memberServer={memberServer} zone={duty.logs_encounter.zone} encounter={duty.logs_encounter.encounter} />
            );
        }

        return (
                <>
                    <div className={`mx-0.5 flex justify-start gap-2 transition-colors duration-300`}>
                        <div className={`w-0.5 bg-paragraph`} />
                        <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20 transition-colors duration-300">
                            <span className="text-paragraph-foreground font-medium"> 最优记录 </span>
                            <span className="text-paragraph-ring text-sm font-medium"> 最远进度 </span>
                        </div>
                    </div>
                    {bestFight && <div className={`mx-1`}><FightCard fight={bestFight} /></div>}

                    <div className={`mx-0.5 flex justify-start gap-2 transition-colors duration-300`}>
                        <div className={`w-0.5 bg-subparagraph`} />
                        <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20 transition-colors duration-300">
                            <span className="text-subparagraph-foreground font-medium"> 近期记录 </span>
                            <span className="text-subparagraph-ring text-sm font-medium"> {expandLatest === "max" ? `最近的 ${limit} 次进度` : "最近的三次进度"} </span>
                        </div>
                    </div>
                    {expandLatest === "max" ? (
                        <div className="mx-1 w-full flex flex-col gap-6">
                            {groupedLatestFights.map((group) => (
                                <div key={group.id} className="flex flex-col gap-3">
                                    {/* Team Header */}
                                    <div className="flex items-center justify-start gap-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-4 bg-paragraph rounded-full" />
                                            <span className="text-sm font-bold text-foreground">队伍阵容</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-ring text-white shadow-sm transition-colors duration-300">
                                            <span className="text-xs font-medium opacity-90">总场次</span>
                                            <span className="text-xs font-bold font-mono">{group.fights.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-destructive-ring text-white shadow-sm transition-colors duration-300">
                                            <span className="text-xs font-medium opacity-90">最远进度</span>
                                            <span className="text-xs font-bold">
                                                {group.bestProgress === "已完成" 
                                                    ? "已完成"
                                                    : group.bestProgress 
                                                        ? `${group.bestProgress} (${(group.minHP * 100).toFixed(1)}%)` 
                                                        : `${(group.minHP * 100).toFixed(1)}%`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Players Grid */}
                                    <div className="grid grid-cols-4 gap-3 py-2 transition-colors duration-300">
                                        {group.players.map((player) => {
                                            const pKey = `${player.name}@${player.server}`;
                                            const deaths = group.totalDeaths[pKey] || 0;
                                            const avgDeaths = (deaths / group.fights.length).toFixed(1);
                                            const icon = getJobIconByID(player.job_id);
                                            const isCurrentMember = player.name === memberName && player.server === memberServer;

                                            // Calculate death king logic
                                            const allDeaths = Object.values(group.totalDeaths);
                                            const maxDeaths = Math.max(...allDeaths);
                                            const maxDeathCount = allDeaths.filter(d => d === maxDeaths).length;
                                            const isDeathKing = deaths === maxDeaths && maxDeaths > 0 && maxDeathCount <= 2;

                                            return (
                                                <Link
                                                    key={pKey}
                                                    to={`/member/${pKey}`}
                                                    className="relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group"
                                                >
                                                    {/* Background Layer with Blur Effect - Mimicking FightCard style */}
                                                    <div 
                                                        className={cn(
                                                            "absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300 z-10",
                                                            isCurrentMember
                                                                ? "bg-primary-ring/10 border-primary-ring" 
                                                                : "bg-card border-card-border group-hover:border-primary-ring/30 group-hover:bg-accent/50"
                                                        )} 
                                                    />

                                                    {/* Content Layer */}
                                                    <div className="relative z-20 flex items-center gap-3 w-full">
                                                        {isCurrentMember && (
                                                            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary-ring rounded-l-lg" />
                                                        )}
                                                        
                                                        {/* Job Icon */}
                                                        {icon && (
                                                            <img
                                                                src={icon}
                                                                alt={player.name}
                                                                className="w-8 h-8 shrink-0"
                                                            />
                                                        )}

                                                        {/* Name & Server */}
                                                        <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                                                            <span className={cn(
                                                                "text-sm font-bold truncate w-full",
                                                                isCurrentMember ? "text-primary-ring" : "text-card-foreground"
                                                            )}>
                                                                {player.name}
                                                            </span>
                                                            <span className={cn(
                                                                "text-[10px] font-mono truncate w-full",
                                                                isCurrentMember ? "text-primary-ring/70" : "text-muted-foreground"
                                                            )}>
                                                                {player.server}
                                                            </span>
                                                        </div>

                                                        {/* Death Count - Mimicking FightCard style */}
                                                        {deaths > 0 && (
                                                            <div className={cn(
                                                                "relative flex items-center justify-center rounded-lg transition-all duration-300 px-2.5 py-1 opacity-90",
                                                            )}>
                                                                <div
                                                                    className={cn(
                                                                        "absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300",
                                                                        // Using destructive colors but with the same structure as FightCard
                                                                        "bg-destructive border-destructive-ring/30",
                                                                    )}
                                                                />
                                                                
                                                                <div className="relative z-20 flex h-full items-center justify-center gap-2 transition-colors duration-300">
                                                                    {isDeathKing && (
                                                                        <Crown className="w-4 h-4 text-destructive-foreground fill-current animate-pulse" />
                                                                    )}
                                                                    <div className="flex flex-col items-start gap-0.5">
                                                                        <div className="flex items-baseline gap-1">
                                                                            <span className="text-destructive-foreground text-[10px] font-medium opacity-80">倒地</span>
                                                                            <span className="text-destructive-foreground text-sm font-bold leading-none">{deaths}</span>
                                                                        </div>
                                                                        <div className="flex items-baseline gap-1">
                                                                            <span className="text-destructive-foreground/70 text-[9px] font-medium">场均</span>
                                                                            <span className="text-destructive-foreground/90 text-[10px] font-bold font-mono leading-none">{avgDeaths}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Fights List */}
                                    <div className="flex flex-wrap gap-2 px-1">
                                        {group.fights.map((fight) => (
                                            <div key={fight.start_time} className="shrink-0">
                                                <FightCard fight={fight} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/* Load More Button */}
                            {limit < 50 && latestFights.length >= limit && (
                                <div 
                                    className="group relative mx-1 flex h-10 items-center justify-center cursor-pointer transition-all duration-300"
                                    onClick={() => setLimit(50)}
                                >
                                    {/* Background Layer */}
                                    <div className="absolute inset-0 rounded-lg border border-card-border bg-card blur-[1px] transition-all duration-300 group-hover:border-primary-ring/50 group-hover:bg-accent/50" />
                                    
                                    {/* Content */}
                                    <div className="relative z-10 flex items-center gap-2">
                                        <span className="text-xs font-bold text-muted-foreground transition-colors duration-300 group-hover:text-primary-ring">
                                            加载更多记录
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        latestFights.length > 0 && (
                            <div className="mx-1 w-full flex flex-wrap gap-2">
                                {latestFights.slice(0, 3).map((fight) => (
                                    <div key={fight.start_time} className="shrink-0">
                                        <FightCard fight={fight} />
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </>
        );
    }

    return (
            <div className="flex flex-col items-start gap-4 w-full">

                {/* Zone Name */}
                {dutyName && <BarZone message={dutyName} detail={duty?.code} setExpand={setExpandLatest} />}

                {/* Fight Content */}
                {fightContent()}
            </div>
    );
}