import { cn } from '@/lib/utils.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { getTextGradient } from '@/lib/gradient.ts';
import type { Fight } from '@/types/fight.ts';

interface FightCardProgressProps {
    fight: Fight;
}

export function FightCardProgress({ fight }: FightCardProgressProps) {
    // progress
    fight.progress.enemy_hp = fight.clear ? 0 : fight.progress.enemy_hp;
    const progressHpRemain = fight.progress.enemy_hp ? (fight.progress.enemy_hp * 100).toFixed(1) : undefined;

    // progress string for dynamic color
    let progressString = fight.progress.phase ? fight.progress.phase : `${progressHpRemain}%`;
    progressString = fight.clear ? `已完成` : progressString;

    return (
        <div className={`flex gap-x-1 gap-y-1 items-center justify-end`}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* default */}
                    <div
                        className={cn(
                            'flex items-baseline justify-end gap-x-1 transition-colors duration-300 text-secondary-foreground',
                            fight.clear ? 'text-primary-foreground' : 'text-secondary-foreground', //cn("bg-clip-text text-transparent", getTextGradient(progressString)),
                        )}
                    >
                        {/* Unclear: Progress */}
                        {!fight.clear && (
                            <div className="flex gap-x-0.5 items-baseline">
                                <span className={cn('text-right justify-start text-[10px] font-medium')}>剩余血量</span>
                                <span className={cn('text-right justify-start text-sm font-mono font-semibold')}>
                                    {progressHpRemain}
                                </span>
                                <span className={cn('text-right justify-start text-xs font-medium')}>%</span>
                            </div>
                        )}

                        {/* Clear */}
                        {fight.clear && (
                            <span className={cn('text-right justify-start text-sm font-medium')}>已完成</span>
                        )}
                    </div>
                </TooltipTrigger>

                {!fight.clear && fight.progress.phase !== 'N/A' && (
                    <TooltipContent>
                        <span
                            className={cn(
                                'text-right justify-start text-sm font-medium bg-clip-text text-transparent',
                                getTextGradient(progressString),
                            )}
                        >
                            {fight.progress.phase}
                        </span>
                    </TooltipContent>
                )}
            </Tooltip>
        </div>
    );
}
