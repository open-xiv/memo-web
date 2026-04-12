import {
    getMemberZoneLatestProgresses,
} from '@/api/sumemo.ts';
import type { Fight } from '@/types/fight.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FightCard from '@/components/custom/fight/list/FightCard.tsx';
import type { DutySummary } from '@/types/duty.ts';
import { BarZone } from '@/components/custom/bar/BarZone.tsx';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';
import { BarLogsNav } from '@/components/custom/bar/BarLogsNav.tsx';
import { FightGroup } from '@/components/custom/fight/layout/FightGroup.tsx';
import { FightList } from '@/components/custom/fight/layout/FightList.tsx';
import { groupFightsByTeam } from '@/lib/fight.ts';
import type { MemberZoneProgress } from '@/types/member.ts';

interface ZoneProgressRowProps {
    zoneID: number;
    memberName: string;
    memberServer: string;
    initialDuty?: DutySummary;
    initialBest?: MemberZoneProgress | null;
}

export default function FightDuty({ zoneID, memberName, memberServer, initialDuty, initialBest }: ZoneProgressRowProps) {
    const [bestFight, setBestFight] = useState<Fight | null>(initialBest?.fight || null);

    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [expandLatest, setExpandLatest] = useState<'min' | 'max'>('min');
    const [latestLoaded, setLatestLoaded] = useState(false);

    const [duty, setDuty] = useState<DutySummary | null>(initialDuty || null);

    const [isLoading, setIsLoading] = useState(!initialDuty);

    const groupFights = useMemo(() => {
        return groupFightsByTeam(latestFights);
    }, [latestFights]);

    // Update state when overview data arrives asynchronously
    useEffect(() => {
        if (initialDuty) {
            setDuty(initialDuty);
            setIsLoading(false);
        }
        if (initialBest !== undefined) {
            setBestFight(initialBest?.fight || null);
        }
    }, [initialDuty, initialBest]);

    // Fetch latest fights on demand (when user expands)
    const fetchLatest = useCallback(async () => {
        if (latestLoaded) return;
        try {
            const latestProgresses = await getMemberZoneLatestProgresses(memberName, memberServer, zoneID, 50);
            setLatestFights(
                latestProgresses
                    .map((p) => p.fight)
                    .filter((f): f is Fight => f !== null)
                    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()),
            );
            setLatestLoaded(true);
        } catch (err) {
            console.error(`failed to fetch latest progresses for zone ${zoneID}:`, err);
        }
    }, [zoneID, memberName, memberServer, latestLoaded]);

    // Trigger latest fetch when expanded
    useEffect(() => {
        if (expandLatest === 'max') {
            void fetchLatest();
        }
    }, [expandLatest, fetchLatest]);

    function fightContent() {
        if (isLoading) {
            return <BarLoading message={`数据加载中`} />;
        }

        if (!bestFight && latestFights.length === 0 && duty && duty.logs_encounter) {
            return (
                <BarLogsNav
                    memberName={memberName}
                    memberServer={memberServer}
                    zone={duty.logs_encounter.zone}
                    encounter={duty.logs_encounter.encounter}
                />
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
                {bestFight && (
                    <div className={`mx-1`}>
                        <FightCard fight={bestFight} duty={duty} />
                    </div>
                )}

                <div className={`mx-0.5 flex justify-start gap-2 transition-colors duration-300`}>
                    <div className={`w-0.5 bg-subparagraph`} />
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20 transition-colors duration-300">
                        <span className="text-subparagraph-foreground font-medium"> 近期记录 </span>
                        <span className="text-subparagraph-ring text-sm font-medium">
                            {' '}
                            {expandLatest === 'max'
                                ? latestLoaded
                                    ? `最近的 ${latestFights.length} 次进度`
                                    : `加载中...`
                                : `展开查看`}{' '}
                        </span>
                    </div>
                </div>

                {expandLatest === 'max' ? (
                    latestLoaded ? (
                        <FightGroup groups={groupFights} memberName={memberName} memberServer={memberServer} />
                    ) : (
                        <BarLoading message={`近期记录加载中`} />
                    )
                ) : (
                    <FightList fights={latestFights} duty={duty} />
                )}
            </>
        );
    }

    return (
        <div className="flex flex-col items-start gap-4 w-full transition-[min-height] duration-300 ease-in-out">
            {/* Zone Name */}
            {duty?.name && <BarZone message={duty.name} detail={duty.code} setExpand={setExpandLatest} />}

            {/* Fight Content */}
            {fightContent()}
        </div>
    );
}
