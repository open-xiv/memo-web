import { useEffect, useState } from 'react';
import { getZoneRecentFights } from '@/api/sumemo.ts';
import type { Fight } from '@/types/fight.ts';
import { getTimeString } from '@/lib/time.ts';
import { FightRosterRow } from '@/components/custom/fight/parts/FightRosterRow.tsx';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';

// poll cadence, aligned with the endpoint's 30 s server-side cache TTL
const REFRESH_MS = 30_000;

interface LatestFightsProps {
    zoneID: number;
    limit?: number;
}

export function LatestFights({ zoneID, limit = 10 }: LatestFightsProps) {
    const [fights, setFights] = useState<Fight[]>([]);
    // gates the loading bar on the FIRST load only; polls swap data in place
    // (no flicker), the same way SyncStatus refreshes.
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetch = () => {
            getZoneRecentFights(zoneID, limit)
                .then((data) => {
                    if (active) setFights(data);
                })
                .catch((err) => {
                    console.error(`failed to fetch recent fights for zone ${zoneID}:`, err);
                })
                .finally(() => {
                    if (active) setInitialLoading(false);
                });
        };

        fetch();
        const id = setInterval(fetch, REFRESH_MS);
        return () => {
            active = false;
            clearInterval(id);
        };
    }, [zoneID, limit]);

    if (initialLoading) {
        return <BarLoading message="最新战斗加载中" />;
    }

    if (fights.length === 0) {
        return null;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {fights.map((fight) => {
                const [time, date] = getTimeString(fight.start_time);
                return (
                    <FightRosterRow key={fight.start_time} fight={fight} label={`${date} ${time}`} />
                );
            })}
        </div>
    );
}
