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
    hasClear?: boolean;
    showPhase?: boolean;
}

export function FightDetail({ zoneID, memberName, memberServer, duty, hasClear, showPhase }: FightDetailProps) {
    const [latestFights, setLatestFights] = useState<Fight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expand, setExpand] = useState<'min' | 'max'>(hasClear ? 'min' : 'max');

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

    // No records to show — hide the detail entirely
    if (!isLoading && displayGroups.length === 0 && !duty?.logs_encounter) {
        return null;
    }

    return (
        <div className="flex flex-col items-start gap-4 w-full">
            {duty?.name && (
                <BarZone message={duty.name} detail={duty.code} expand={expand} setExpand={setExpand} />
            )}

            {isLoading ? (
                <BarLoading message="近期记录加载中" />
            ) : displayGroups.length > 0 ? (
                <FightGroup groups={displayGroups} memberName={memberName} memberServer={memberServer} showPhase={showPhase} />
            ) : duty?.logs_encounter ? (
                <BarLogsNav
                    memberName={memberName}
                    memberServer={memberServer}
                    zone={duty.logs_encounter.zone}
                    encounter={duty.logs_encounter.encounter}
                />
            ) : null}
        </div>
    );
}
