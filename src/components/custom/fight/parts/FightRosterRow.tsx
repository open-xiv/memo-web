import { useMemo, type ReactNode } from 'react';
import type { Fight } from '@/types/fight.ts';
import { sortPlayersInFight } from '@/lib/job.ts';
import { getTimeAgo } from '@/lib/time.ts';
import { cn } from '@/lib/utils.ts';
import { PlayerGrid } from '@/components/custom/fight/parts/PlayerGrid.tsx';

interface FightRosterRowProps {
    fight: Fight;
    // left-side heading for the row (e.g. "第 1 名" or a timestamp)
    label: ReactNode;
}

// A single fight rendered as a team header (Badge) + roster (PlayerGrid),
// shared by the leaderboard and the latest-fights list. Each row is one fight,
// not a session aggregate, so the badge shows the bare progress (phase + HP%),
// with no "进度" / "最远进度" prefix.
export function FightRosterRow({ fight, label }: FightRosterRowProps) {
    const sorted = useMemo(() => sortPlayersInFight(fight), [fight]);

    // single-fight death map for PlayerGrid (no current-member highlight here)
    const totalDeaths = useMemo(() => {
        const deaths: Record<string, number> = {};
        sorted.players.forEach((p) => {
            deaths[`${p.name}@${p.server}`] = p.death_count;
        });
        return deaths;
    }, [sorted]);

    const phase = fight.progress.phase_name;
    const hpRemain = fight.clear ? 0 : fight.progress.enemy_hp;

    return (
        <div className="mx-0.5 flex flex-col gap-3">
            {/* Team header — mirrors FightGroupItem */}
            <div className="flex flex-wrap items-center justify-start gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-0.5 h-4 bg-accent-amber-strong rounded-full" />
                    <span className="text-sm font-semibold text-on-accent-amber">{label}</span>
                </div>

                <div className={cn('flex gap-2')}>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-amber border border-accent-amber-border text-on-surface shadow-sm transition-colors duration-300">
                        <span className={cn('text-xs text-on-accent-amber font-medium')}>
                            {getTimeAgo(fight.start_time)}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2 px-2.5 py-1 rounded-md bg-accent-pink border border-accent-pink-border text-on-accent-pink shadow-sm transition-colors duration-300">
                        {fight.clear ? (
                            <span className={cn('text-xs font-medium')}>已完成</span>
                        ) : (
                            <>
                                {phase && phase !== 'N/A' && (
                                    <span className={cn('text-xs font-medium')}>{phase}</span>
                                )}
                                <div className={cn('flex items-baseline gap-1')}>
                                    <span className={cn('text-xs font-semibold text-accent-pink-strong')}>
                                        {(hpRemain * 100).toFixed(1)}
                                    </span>
                                    <span className={cn('text-tiny font-medium')}>%</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Players grid */}
            <PlayerGrid players={sorted.players} totalDeaths={totalDeaths} memberName="" memberServer="" />
        </div>
    );
}
