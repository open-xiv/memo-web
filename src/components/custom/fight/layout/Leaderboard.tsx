import { useEffect, useState } from 'react';
import { getZoneLeaderboard } from '@/api/sumemo.ts';
import type { Fight } from '@/types/fight.ts';
import { FightRosterRow } from '@/components/custom/fight/parts/FightRosterRow.tsx';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';

// poll cadence, aligned with the endpoint's 30 s server-side cache TTL
const REFRESH_MS = 30_000;

interface LeaderboardProps {
    zoneID: number;
    limit?: number;
}

export function Leaderboard({ zoneID, limit = 10 }: LeaderboardProps) {
    const [fights, setFights] = useState<Fight[]>([]);
    // gates the loading bar on the FIRST load only; polls swap data in place
    // (no flicker), the same way SyncStatus refreshes.
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetch = () => {
            getZoneLeaderboard(zoneID, limit)
                .then((data) => {
                    if (active) setFights(data);
                })
                .catch((err) => {
                    console.error(`failed to fetch leaderboard for zone ${zoneID}:`, err);
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
        return <BarLoading message="排行榜加载中" />;
    }

    if (fights.length === 0) {
        return null;
    }

    return (
        <div className="w-full flex flex-col gap-6">
            {fights.map((fight, i) => (
                <FightRosterRow key={fight.start_time} fight={fight} label={`第 ${i + 1} 名`} />
            ))}
        </div>
    );
}
