import { getDutyByID, getDutyNameByID, getMemberZoneBestProgress, getMemberZoneLatestProgresses } from "@/api/sumemo.ts";
import type { Fight } from "@/types/fight.ts";
import { useEffect, useState } from "react";
import FightCard from "@/components/custom/fight/card/FightCard.tsx";
import type { Duty } from "@/types/duty.ts";
import { BarZone } from "@/components/custom/bar/BarZone.tsx";
import { BarLoading } from "@/components/custom/bar/BarLoading.tsx";
import { BarLogsNav } from "@/components/custom/bar/BarLogsNav.tsx";


interface ZoneProgressRowProps {
    zoneID: number,
    memberName: string,
    memberServer: string,
}

export default function FightDuty({ zoneID, memberName, memberServer }: ZoneProgressRowProps) {
    const [bestFight, setBestFight] = useState<Fight | null>(null);

    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [expandLatest, setExpandLatest] = useState<"min" | "max">("min");

    const [dutyName, setDutyName] = useState<string | null>(null);
    const [duty, setDuty] = useState<Duty | null>(null);

    const [isLoading, setIsLoading] = useState(true);

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
                    getMemberZoneLatestProgresses(memberName, memberServer, zoneID),
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
    }, [zoneID, memberName, memberServer]);

    if (isLoading) {
        return (
                <BarLoading message={`数据加载中`} />
        );
    }


    function fightContent() {
        if (!bestFight && latestFights.length === 0 && duty && duty.logs_encounter) {
            return (
                    <BarLogsNav memberName={memberName} memberServer={memberServer} zone={duty.logs_encounter.zone} encounter={duty.logs_encounter.zone} />
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
                            <span className="text-subparagraph-ring text-sm font-medium"> {expandLatest === "max" ? "最近的十次进度" : "最近的三次进度"} </span>
                        </div>
                    </div>
                    {latestFights.length > 0 && (
                            <div className="mx-1 w-full flex flex-wrap gap-2">
                                {latestFights.slice(0, expandLatest === "max" ? 10 : 3).map((fight) => (
                                        <div key={fight.id} className="flex-shrink-0">
                                            <FightCard fight={fight} />
                                        </div>
                                ))}
                            </div>
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