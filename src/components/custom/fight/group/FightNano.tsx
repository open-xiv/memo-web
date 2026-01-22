import type { Fight } from '@/types/fight.ts';
import { sortPlayersInFight } from '@/lib/job.ts';
import { FightCardProgress } from '@/components/custom/fight/list/FightCardProgress.tsx';
import { getDurationString, getTimeRangeString, getTimeString } from '@/lib/time.ts';
import { cn } from '@/lib/utils.ts';

interface FightNanoProps {
    fight: Fight;
}

export default function FightNano({ fight }: FightNanoProps) {
    // sort member by job role
    fight = sortPlayersInFight(fight);

    // time string
    const timeString =
        fight.duration > 0 ? getTimeRangeString(fight.start_time, fight.duration) : getTimeString(fight.start_time);

    // duration text
    const durationText = fight.duration > 0 ? getDurationString(fight.duration) : undefined;

    return (
        <div className="w-80 relative flex flex-row items-baseline justify-between p-4 gap-2">
            <div className="w-full h-full absolute inset-0 bg-card rounded-lg border border-card-border blur-[2px] z-10"></div>

            {/* progress  */}
            <div className="z-20">
                <FightCardProgress fight={fight} />
            </div>

            {/* time */}
            <div className="flex flex-row items-baseline justify-start gap-2 z-20">
                <span className={cn('text-muted-foreground text-tiny')}>{durationText}</span>
                <span className="text-card-foreground text-sm font-medium">{timeString[0]}</span>
            </div>
        </div>
    );
}
