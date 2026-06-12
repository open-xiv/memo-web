import { useEffect, useMemo, useRef, useState } from 'react';
import { getZoneLeaderboard } from '@/api/sumemo.ts';
import type { Fight } from '@/types/fight.ts';
import { FightRosterRow } from '@/components/custom/fight/parts/FightRosterRow.tsx';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';
import ToggleSegment, { type SegmentOption } from '@/components/custom/toggle/ToggleSegment.tsx';

// poll cadence, aligned with the endpoint's 30 s server-side cache TTL
const REFRESH_MS = 30_000;

// sentinel category value for cleared teams (phase names use their own labels)
const CLEAR = '__clear__';

interface LeaderboardProps {
    zoneID: number;
    // how many teams to fetch from the endpoint
    limit?: number;
}

// each row carries its global rank so filtering a category still shows the
// team's true overall standing (categories are contiguous blocks in the list).
interface RankedFight {
    fight: Fight;
    rank: number;
}

export function Leaderboard({ zoneID, limit = 100 }: LeaderboardProps) {
    const [fights, setFights] = useState<Fight[]>([]);
    // gates the loading bar on the FIRST load only; polls swap data in place
    // (no flicker), the same way SyncStatus refreshes.
    const [initialLoading, setInitialLoading] = useState(true);
    // active progress-category; null until the first category set is known
    const [category, setCategory] = useState<string | null>(null);
    const topRef = useRef<HTMLDivElement>(null);

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

    // categories present in the data: 已通关 first, then phases high→low
    const categories = useMemo<SegmentOption[]>(() => {
        const options: SegmentOption[] = [];
        if (fights.some((f) => f.clear)) {
            options.push({ value: CLEAR, label: '已通关' });
        }
        const phases = new Map<string, number>();
        fights.forEach((f) => {
            if (!f.clear && f.progress.phase_name) {
                phases.set(f.progress.phase_name, f.progress.phase);
            }
        });
        [...phases.entries()]
            .sort((a, b) => b[1] - a[1])
            .forEach(([name]) => options.push({ value: name, label: name }));
        return options;
    }, [fights]);

    // resolve the live selection: keep it if still valid, else fall back to the
    // first category (handles initial load and a category vanishing on refresh)
    const activeCategory =
        category && categories.some((c) => c.value === category) ? category : (categories[0]?.value ?? null);

    // mirror the resolved value back into state so onChange comparisons agree
    useEffect(() => {
        if (category !== activeCategory) setCategory(activeCategory);
    }, [category, activeCategory]);

    const visible = useMemo<RankedFight[]>(() => {
        const ranked = fights.map((fight, i) => ({ fight, rank: i + 1 }));
        if (!activeCategory) return ranked;
        if (activeCategory === CLEAR) return ranked.filter((r) => r.fight.clear);
        return ranked.filter((r) => !r.fight.clear && r.fight.progress.phase_name === activeCategory);
    }, [fights, activeCategory]);

    const onCategoryChange = (next: string) => {
        if (next === activeCategory) return;
        setCategory(next);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (initialLoading) {
        return <BarLoading message="排行榜加载中" />;
    }

    if (fights.length === 0) {
        return null;
    }

    return (
        <div ref={topRef} className="w-full flex flex-col gap-6 scroll-mt-4">
            {categories.length > 1 && activeCategory && (
                <ToggleSegment options={categories} value={activeCategory} onChange={onCategoryChange} />
            )}

            {visible.map(({ fight, rank }) => (
                <FightRosterRow key={fight.start_time} fight={fight} label={`第 ${rank} 名`} />
            ))}
        </div>
    );
}
