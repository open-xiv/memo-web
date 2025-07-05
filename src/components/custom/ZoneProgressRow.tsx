import {getFightByID, getMemberZoneBestProgress, getMemberZoneLatestProgresses, getZoneNameByID} from "@/api";
import type {Fight} from "@/types/fight.ts";
import {useEffect, useState} from "react";
import ErrIcon from "@/assets/error.svg?react";
import TargetIcon from "@/assets/target.svg?react";
import FightIcon from "@/assets/fight.svg?react";
import FightCard from "@/components/custom/FightCard.tsx";

interface ZoneProgressRowProps {
    zoneID: number,
    playerName: string,
    playerServer: string,
}

export default function ZoneProgressRow({zoneID, playerName, playerServer}: ZoneProgressRowProps) {
    const [bestFight, setBestFight] = useState<Fight | null>(null);
    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [zoneName, setZoneName] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);

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
                <div className="w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <TargetIcon className="h-6 w-6"/>
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-amber-950 text-base font-medium"> 数据加载中 </span>
                        <span className="text-amber-600 text-base font-medium">  </span>
                    </div>
                </div>
            </div>
        );
    }

    function fightContent() {
        if (!bestFight && latestFights.length === 0) {
            return (
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-red-50 rounded-lg border border-red-300 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <ErrIcon className="h-6 w-6"/>
                        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                            <span className="text-red-950 text-base font-medium"> 未记录 </span>
                            <span className="text-red-600 text-base font-medium"> 请通过其他途径判断 </span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <>
                <div className={`mx-0.5 flex justify-start gap-2`}>
                    <div className={`w-0.5 bg-zinc-400`}/>
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
                        <span className="text-red-950 text-base font-medium"> 最优记录 </span>
                        <span className="text-red-800 text-sm font-medium"> 最远进度 </span>
                    </div>
                </div>
                {bestFight && <div className={`mx-1`}><FightCard fight={bestFight}/></div>}

                <div className={`mx-0.5 flex justify-start gap-2`}>
                    <div className={`w-0.5 bg-indigo-400`}/>
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
                        <span className="text-indigo-950 text-base font-medium"> 近期记录 </span>
                        <span className="text-indigo-800 text-sm font-medium"> 最近的三次进度 </span>
                    </div>
                </div>
                {latestFights.length > 0 && (
                    <div className="mx-1 w-full flex flex-wrap gap-2">
                        {latestFights.map((fight) => (
                            <div key={fight.id} className="flex-shrink-0">
                                <FightCard fight={fight}/>
                            </div>
                        ))}
                    </div>
                )}</>
        );
    }

    return (
        <div className="flex flex-col items-start gap-4 w-full">

            {/* Zone Name */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-teal-50 rounded-lg border border-teal-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <FightIcon className="h-6 w-6"/>
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-teal-950 text-base font-medium"> {zoneName} </span>
                        <span className="text-teal-600 text-base font-medium">  </span>
                    </div>
                </div>
            </div>

            {/* Fight Content */}
            {fightContent()}
        </div>
    );
}