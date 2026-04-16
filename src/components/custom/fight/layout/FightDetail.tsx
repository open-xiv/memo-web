import { useCallback, useEffect, useMemo, useState } from 'react';
import { getMemberZoneLatestProgresses } from '@/api/sumemo.ts';
import type { Fight } from '@/types/fight.ts';
import type { DutySummary } from '@/types/duty.ts';
import { FightGroup } from '@/components/custom/fight/layout/FightGroup.tsx';
import { groupFightsByTeam } from '@/lib/fight.ts';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';
import { BarLogsNav } from '@/components/custom/bar/BarLogsNav.tsx';
import { BarZone } from '@/components/custom/bar/BarZone.tsx';

interface FightDetailProps {
    zoneID: number;
    memberName: string;
    memberServer: string;
    duty?: DutySummary;
}

export function FightDetail({ zoneID, memberName, memberServer, duty }: FightDetailProps) {
    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expand, setExpand] = useState<'min' | 'max'>('min');

    const groupFights = useMemo(() => groupFightsByTeam(latestFights), [latestFights]);
    const displayGroups = expand === 'min' ? groupFights.slice(0, 1) : groupFights;

    const fetchLatest = useCallback(async () => {
        setIsLoading(true);
        try {
            const progresses = await getMemberZoneLatestProgresses(memberName, memberServer, zoneID, 50);
            setLatestFights(
                progresses
                    .map((p) => p.fight)
                    .filter((f): f is Fight => f !== null)
                    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()),
            );
        } catch (err) {
            console.error(`failed to fetch latest progresses for zone ${zoneID}:`, err);
        } finally {
            setIsLoading(false);
        }
    }, [zoneID, memberName, memberServer]);

    useEffect(() => {
        void fetchLatest();
    }, [fetchLatest]);

    return (
        <div className="flex flex-col items-start gap-4 w-full">
            {duty?.name && (
                <BarZone message={duty.name} detail={duty.code} setExpand={setExpand} />
            )}

            {isLoading ? (
                <BarLoading message="近期记录加载中" />
            ) : displayGroups.length > 0 ? (
                <FightGroup groups={displayGroups} memberName={memberName} memberServer={memberServer} />
            ) : duty?.logs_encounter ? (
                <BarLogsNav
                    memberName={memberName}
                    memberServer={memberServer}
                    zone={duty.logs_encounter.zone}
                    encounter={duty.logs_encounter.encounter}
                />
            ) : (
                <div className="text-sm text-muted-foreground ml-3">暂无近期记录</div>
            )}
        </div>
    );
}
