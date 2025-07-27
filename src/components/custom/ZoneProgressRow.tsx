import {getFightByID, getMemberZoneBestProgress, getMemberZoneLatestProgresses, getZoneByID, getZoneNameByID} from "@/api/sumemo.ts";
import type {Fight} from "@/types/fight.ts";
import {useEffect, useState} from "react";
import ErrIcon from "@/assets/icon/error.svg?react";
import TargetIcon from "@/assets/icon/target.svg?react";
import FightIcon from "@/assets/icon/fight.svg?react";
import FightCard from "@/components/custom/FightCard.tsx";
import LinkIcon from "@/assets/icon/link.svg?react";
import type {Zone} from "@/types/zone.ts";
import Icon from "@/components/custom/Icon.tsx";
import {useTheme} from "@/context/ThemeContext.ts";
import ExpandToggle from "@/components/custom/ExpandToggle.tsx";


interface ZoneProgressRowProps {
    zoneID: number,
    playerName: string,
    playerServer: string,
}

export default function ZoneProgressRow({zoneID, playerName, playerServer}: ZoneProgressRowProps) {
    const {theme} = useTheme();

    const [bestFight, setBestFight] = useState<Fight | null>(null);

    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [expandLatest, setExpandLatest] = useState<"min" | "max">("min");

    const [zoneName, setZoneName] = useState<string | null>(null);
    const [zone, setZone] = useState<Zone | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const zoneData = await getZoneByID(zoneID);
                setZone(zoneData);
            } catch (error) {
                console.error("Error fetching zone data:", error);
                setZone(null);
            }
        };

        fetchZone();
    }, [zoneID]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // fetch zone name
                const zoneName = await getZoneNameByID(zoneID);
                setZoneName(zoneName);

                // fetch best and latest progresses
                const [bestProgress, latestProgresses] = await Promise.all([
                    getMemberZoneBestProgress(playerName, playerServer, zoneID),
                    getMemberZoneLatestProgresses(playerName, playerServer, zoneID)
                ]);

                const fightIdsToFetch = new Set<number>();
                if (bestProgress?.fight_id) {
                    fightIdsToFetch.add(bestProgress.fight_id);
                }
                latestProgresses.forEach(p => {
                    if (p.fight_id) fightIdsToFetch.add(p.fight_id);
                });

                if (fightIdsToFetch.size === 0) {
                    setIsLoading(false);
                    return;
                }

                // fetch fight details
                const fightDetails = await Promise.all(
                    Array.from(fightIdsToFetch).map(id => getFightByID(id))
                );
                const fightMap = new Map(fightDetails.map(f => [f.id, f]));

                // update fight data
                if (bestProgress?.fight_id) {
                    setBestFight(fightMap.get(bestProgress.fight_id) || null);
                }
                setLatestFights(
                    latestProgresses
                        .map(p => p.fight_id ? fightMap.get(p.fight_id) : null)
                        .filter((f): f is Fight => f !== null)
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                );
            } catch (err) {
                console.error(`failed to fetch progress for zone ${zoneID}:`, err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [zoneID, playerName, playerServer]);

    if (isLoading) {
        return (
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-300 dark:border-amber-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={TargetIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-amber-400" : "--color-amber-400"})`}
                        secondary={`var(${theme === "light" ? "--color-amber-950" : "--color-amber-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-amber-950 dark:text-amber-200 text-base font-medium"> 数据加载中 </span>
                        <span className="text-amber-600 dark:text-amber-400 text-base font-medium">  </span>
                    </div>
                </div>
            </div>
        );
    }

    const logsLink = `https://fflogs.com/character/cn/${playerServer}/${playerName}?zone=${zone?.logs.zone}&boss=${zone?.logs.encounter}`;

    function fightContent() {
        if (!bestFight && latestFights.length === 0) {
            return (
                <div className={`w-full flex gap-2 flex-wrap`}>
                    <div className="w-full md:w-1/3 relative flex items-center justify-center p-3 opacity-70">
                        <div className="w-full h-full absolute bg-red-50 dark:bg-red-950 rounded-lg border border-red-300 dark:border-red-700 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <Icon
                                icon={ErrIcon}
                                className={`h-6 w-6`}
                                primary={`var(${theme === "light" ? "--color-red-400" : "--color-red-400"})`}
                                secondary={`var(${theme === "light" ? "--color-red-950" : "--color-red-200"})`}
                            />
                            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center`}>
                                <span className="text-red-950 dark:text-red-200 text-base font-medium"> 未记录 </span>
                                <span className="text-red-600 dark:text-red-400 text-base font-medium"> 请通过其他途径判断 </span>
                            </div>
                        </div>
                    </div>
                    <a href={logsLink} className="relative flex items-center justify-center p-3 opacity-80 px-4">
                        <div className="w-full h-full absolute bg-pink-50 dark:bg-pink-950 rounded-lg border border-pink-300 dark:border-pink-700 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-center gap-2 z-20">
                            <Icon
                                icon={LinkIcon}
                                className={`h-6 w-6`}
                                primary={`var(${theme === "light" ? "--color-pink-400" : "--color-pink-400"})`}
                                secondary={`var(${theme === "light" ? "--color-zinc-950" : "--color-zinc-200"})`}
                            />
                            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center`}>
                                <span className="text-pink-950 dark:text-pink-200 text-base font-medium"> 快速跳转 </span>
                                <span className="text-pink-600 dark:text-pink-400 text-base font-medium"> FFLogs </span>
                            </div>
                        </div>
                    </a>
                </div>
            );
        }

        return (
            <>
                <div className={`mx-0.5 flex justify-start gap-2`}>
                    <div className={`w-0.5 bg-red-400 dark:bg-red-500`}/>
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
                        <span className="text-red-950 dark:text-red-200 text-base font-medium"> 最优记录 </span>
                        <span className="text-red-800 dark:text-red-300 text-sm font-medium"> 最远进度 </span>
                    </div>
                </div>
                {bestFight && <div className={`mx-1`}><FightCard fight={bestFight}/></div>}

                <div className={`mx-0.5 flex justify-start gap-2`}>
                    <div className={`w-0.5 bg-indigo-400 dark:bg-indigo-500`}/>
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
                        <span className="text-indigo-950 dark:text-indigo-200 text-base font-medium"> 近期记录 </span>
                        <span className="text-indigo-800 dark:text-indigo-300 text-sm font-medium"> {expandLatest === "max" ? "最近的二十次进度" : "最近的三次进度"} </span>
                    </div>
                </div>
                {latestFights.length > 0 && (
                    <div className="mx-1 w-full flex flex-wrap gap-2">
                        {latestFights.slice(0, expandLatest === "max" ? 20 : 3).map((fight) => (
                            <div key={fight.id} className="flex-shrink-0">
                                <FightCard fight={fight}/>
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
            <div className="w-full md:w-2/5 relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-teal-50 dark:bg-teal-950 rounded-lg border border-teal-300 dark:border-teal-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={FightIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-teal-400" : "--color-teal-400"})`}
                        secondary={`var(${theme === "light" ? "--color-teal-950" : "--color-teal-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-teal-950 dark:text-teal-200 text-base font-medium"> {zoneName} </span>
                        <span className="text-teal-600 dark:text-teal-400 text-base font-medium">  </span>
                    </div>
                </div>
                <ExpandToggle setExpand={setExpandLatest}/>
            </div>

            {/* Fight Content */}
            {fightContent()}
        </div>
    );
}