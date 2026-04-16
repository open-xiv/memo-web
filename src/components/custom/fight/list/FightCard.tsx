import type { Fight } from '@/types/fight.ts';
import type { DutySummary } from '@/types/duty.ts';
import { useHeaderContext } from '@/context/HeaderContext.ts';
import { getJobIconByID, sortPlayersInFight } from '@/lib/job.ts';
import { useMemo } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card.tsx';
import FightCardNameplate from '@/components/custom/fight/list/FightCardNameplate.tsx';
import { Link } from 'react-router-dom';
import { FightCardProgress } from '@/components/custom/fight/list/FightCardProgress.tsx';
import { getDurationString, getTimeAgo, getTimeRangeString, getTimeString } from '@/lib/time.ts';
import { cn } from '@/lib/utils.ts';

interface FightCardProps {
    fight: Fight;
    duty?: DutySummary | null;
    selected?: boolean;
}

export default function FightCard({ fight, duty, selected }: FightCardProps) {
    const { memberName, memberServer } = useHeaderContext();

    // sort member by job role (memoized)
    const sortedFight = useMemo(() => sortPlayersInFight(fight), [fight]);

    // local player job icon
    const localPlayer =
        (memberName && memberServer
            ? sortedFight.players.find((p) => p.name === memberName && p.server === memberServer)
            : sortedFight.players[0]) || undefined;
    const localJobIcon = localPlayer ? getJobIconByID(localPlayer.job_id) : undefined;

    // party job icons
    const partyPlayers = sortedFight.players.filter((p) => p.name !== localPlayer?.name);
    const partyJobIcons = partyPlayers.map((p) => getJobIconByID(p.job_id)).filter(Boolean) as string[];

    // time string
    const timeString =
        sortedFight.duration > 0 ? getTimeRangeString(sortedFight.start_time, sortedFight.duration) : getTimeString(sortedFight.start_time);
    const timeAgo = getTimeAgo(sortedFight.start_time);

    // duration text
    const durationText = sortedFight.duration > 0 ? getDurationString(sortedFight.duration) : undefined;

    // stable short id derived from fight data
    const comments = useMemo(() => {
        const raw = `${sortedFight.start_time}-${sortedFight.zone_id}`;
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
        }
        return Math.abs(hash).toString(16).slice(0, 4);
    }, [sortedFight.start_time, sortedFight.zone_id]);

    // name or alias — prefer full name for overview display
    const zoneAlias = duty?.name || duty?.code || `Zone ${sortedFight.zone_id}`;

    return (
        <div className="group w-80 relative flex flex-col items-center p-4 gap-2">
            <div className={cn(
                'w-full h-full absolute inset-0 rounded-lg border blur-[2px] z-10 transition-all duration-300',
                selected
                    ? 'bg-primary/30 border-primary-border'
                    : 'bg-card border-card-border group-hover:border-secondary-border group-hover:bg-secondary/30',
            )} />

            {/* local job icon - zone - time */}
            <div className="w-full flex items-start justify-between z-20">
                <div className="flex items-center justify-center gap-2.5">
                    {/* local job icon */}
                    {localJobIcon && <img src={localJobIcon} alt={`job ${localPlayer?.job_id}`} className="w-9 h-9" />}
                    {/* zone */}
                    <div className="flex flex-col items-start justify-center gap-0.5">
                        <div className={`flex gap-0.5 items-center`}>
                            <span className="text-card-foreground text-sm font-medium">{zoneAlias}</span>
                        </div>
                        <span className="text-card-ring text-xs font-normal font-mono">#{comments}</span>
                    </div>

                    {/* death */}
                    {localPlayer?.death_count != undefined && localPlayer.death_count !== 0 && (
                        <div
                            className={cn(
                                'relative flex items-center justify-center rounded-lg transition-all duration-300 px-2.5 py-1 opacity-80',
                            )}
                        >
                            <div
                                className={cn(
                                    'absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300',
                                    'bg-secondary border-secondary-border',
                                )}
                            />

                            <div className="relative z-20 flex h-full items-baseline justify-center gap-1 transition-colors duration-300">
                                <span className="text-secondary-foreground text-sm font-medium">
                                    {localPlayer?.death_count}
                                </span>
                                <span className="text-secondary-ring text-xs font-medium">次倒地</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* time */}
                <div className="flex flex-col items-end justify-start gap-0.5">
                    <span className="text-card-foreground text-sm font-medium">{timeString[0]}</span>
                    <div className="flex flex-col items-end gap-0 text-card-ring text-tiny">
                        {durationText && <span className={cn('text-muted-foreground')}>{durationText}</span>}
                        <div className="flex items-center gap-1 opacity-80">
                            <span>{timeAgo}</span>
                            <span>·</span>
                            <span>{timeString[1]}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* party job icon - progress  */}
            <div className="w-full flex items-end justify-between z-20">
                {/* party job icons */}
                <div className="flex items-center justify-start gap-1">
                    {partyJobIcons.map((icon, index) => (
                        <div key={index}>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Link
                                        to={`/member/${partyPlayers[index].name}@${partyPlayers[index].server}`}
                                        className="flex items-center justify-center"
                                    >
                                        <img src={icon} alt={`job ${index}`} className="w-6 h-6" />
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent
                                    className={`w-auto h-auto p-0 border-0 bg-transparent shadow-none`}
                                    sideOffset={12}
                                >
                                    <FightCardNameplate player={partyPlayers[index]} />
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    ))}
                </div>
                {/* progress */}
                <FightCardProgress fight={sortedFight} />
            </div>
        </div>
    );
}
