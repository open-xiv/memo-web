import { cn } from '@/lib/utils.ts';
import { getTextGradient } from '@/lib/gradient.ts';
import type { Fight } from '@/types/fight.ts';

interface FightProgressProps {
    fight: Fight;
    showPhase?: boolean;
}

export function FightProgress({ fight, showPhase = false }: FightProgressProps) {
    // progress
    fight.progress.enemy_hp = fight.clear ? 0 : fight.progress.enemy_hp;
    const progressHpRemain = fight.progress.enemy_hp ? (fight.progress.enemy_hp * 100).toFixed(1) : undefined;

    const phaseName = fight.progress.phase_name;
    const hasPhase = showPhase && !!phaseName;

    return (
        <div className={cn('flex gap-x-1 items-baseline justify-end')}>
            {fight.clear ? (
                <span className={cn('text-sm font-medium text-role-healer-strong/70')}>已完成</span>
            ) : (
                <div className="flex gap-x-1 items-baseline justify-end text-on-accent-amber">
                    {/* ultimate: phase */}
                    {hasPhase && (
                        <span
                            className={cn(
                                'text-sm font-mono font-medium bg-clip-text text-transparent',
                                getTextGradient(phaseName),
                            )}
                        >
                            {phaseName}
                        </span>
                    )}

                    {/* remaining hp */}
                    <div className="flex gap-x-0.5 items-baseline">
                        <span className={cn('font-medium text-[10px]')}>余</span>
                        <span className={cn('text-sm font-mono font-semibold')}>{progressHpRemain}</span>
                        <span className={cn('text-[10px] font-medium')}>%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
