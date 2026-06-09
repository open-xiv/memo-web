import type { Fight } from '@/types/fight.ts';
import { getDurationString, getTimeAgo, getTimeRangeString, getTimeString } from '@/lib/time.ts';
import { cn } from '@/lib/utils.ts';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card.tsx';
import { FightProgress } from '@/components/custom/fight/parts/FightProgress.tsx';

interface FightNanoProps {
    fight: Fight;
    showPhase?: boolean;
}

function getRingColor(progress: number): string {
    if (progress >= 0.8) return 'text-accent-pink-strong/40';
    if (progress >= 0.5) return 'text-accent-amber-strong/40';
    return 'text-on-surface-muted/60';
}

function ProgressRing({ progress, clear, colorClass }: { progress: number; clear: boolean; colorClass: string }) {
    if (clear) {
        return <div className="size-7 shrink-0 rounded-full bg-role-healer-strong/70" />;
    }

    const progressDeg = progress * 360;

    return (
        <div className="relative size-7 shrink-0">
            <div
                className={cn('size-full rounded-full bg-surface-card-border/20', colorClass)}
                style={{
                    backgroundImage: `conic-gradient(currentColor ${progressDeg}deg, transparent 0deg)`,
                    maskImage: 'radial-gradient(circle at center, transparent 45%, black 47%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, transparent 45%, black 47%)',
                }}
            />
        </div>
    );
}

export default function FightNano({ fight, showPhase }: FightNanoProps) {
    const progress = fight.clear ? 1 : Math.min(1, Math.max(0, 1 - fight.progress.enemy_hp));

    const timeRange =
        fight.duration > 0 ? getTimeRangeString(fight.start_time, fight.duration) : getTimeString(fight.start_time);
    const durationText = fight.duration > 0 ? getDurationString(fight.duration) : undefined;
    const timeAgo = getTimeAgo(fight.start_time);

    const ringColorClass = getRingColor(progress);

    return (
        <HoverCard openDelay={100} closeDelay={50}>
            <HoverCardTrigger asChild>
                <div className="flex items-center p-2 pr-3.5 gap-2 rounded-full border border-dashed border-surface-card-border cursor-default">
                    {/* ring */}
                    <ProgressRing progress={progress} clear={fight.clear} colorClass={ringColorClass} />

                    {/* text */}
                    <FightProgress fight={fight} showPhase={showPhase} />
                </div>
            </HoverCardTrigger>

            <HoverCardContent className="w-auto p-2.5 bg-surface-card border-surface-card-border" sideOffset={6}>
                <div className="flex flex-col gap-0.5 text-xs">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-on-surface-card font-medium">{timeRange[0]}</span>
                        <span className="text-on-surface-muted">{timeRange[1]}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 text-tiny text-on-surface-muted">
                        {durationText && <span>{durationText}</span>}
                        {durationText && <span>·</span>}
                        <span>{timeAgo}</span>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
