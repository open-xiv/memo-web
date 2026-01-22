import { getTimeAgo, getTimeString } from '@/lib/time.ts';
import type { FightGroup as FightGroupType } from '@/lib/fight.ts';
import { PlayerGrid } from '@/components/custom/fight/group/PlayerGrid.tsx';
import { cn } from '@/lib/utils.ts';
import FightNano from '@/components/custom/fight/group/FightNano.tsx';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';

interface FightGroupProps {
    groups: FightGroupType[];
    memberName: string;
    memberServer: string;
}

function getTimeRangeDisplay(startTime: string, duration: number): [string, string] {
    const [startTimeStr, startDate] = getTimeString(startTime);
    const endTimeMs = new Date(startTime).getTime() + duration / 1e6;
    const [endTimeStr, endDate] = getTimeString(new Date(endTimeMs).toISOString());

    if (startDate === endDate) {
        return [startDate, `${startTimeStr} ~ ${endTimeStr}`];
    } else {
        return [startDate, `${startTimeStr} ~ ${endDate} ${endTimeStr}`];
    }
}

interface FightGroupItemProps {
    group: FightGroupType;
    memberName: string;
    memberServer: string;
}

function FightGroupItem({ group, memberName, memberServer }: FightGroupItemProps) {
    const [date, timeRange] = getTimeRangeDisplay(group.startTime, group.duration);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <div className="mx-0.5 flex flex-col gap-3">
            {/* Team Header */}
            <div className="flex flex-wrap items-center justify-start gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-0.5 h-4 bg-secondary-ring rounded-full" />
                    <span className="text-sm font-semibold text-secondary-foreground">队伍阵容</span>
                </div>

                <div className={cn('flex gap-2')}>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary border border-secondary-border text-foreground shadow-sm transition-colors duration-300">
                        <div className="flex items-baseline gap-1.5 text-xs">
                            <span className={cn('text-secondary-foreground font-medium')}>
                                {getTimeAgo(group.startTime)}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{date}</span>
                            <span className="text-muted-foreground">{timeRange}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div
                                    className="flex items-baseline gap-2 px-2 py-1 rounded-md bg-zone border border-zone-border text-zone-foreground shadow-sm transition-colors duration-300 cursor-pointer hover:bg-zone/80"
                                    onMouseEnter={() => setIsPopoverOpen(true)}
                                    onMouseLeave={() => setIsPopoverOpen(false)}
                                >
                                    <span className="text-xs">总场次</span>
                                    <span className="text-xs font-medium">{group.fights.length}</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto max-h-96 overflow-y-auto p-2 bg-zone border border-zone-foreground"
                                onMouseEnter={() => setIsPopoverOpen(true)}
                                onMouseLeave={() => setIsPopoverOpen(false)}
                                side="bottom"
                                align="start"
                            >
                                <div className="flex flex-col gap-2">
                                    {group.fights.map((fight) => (
                                        <FightNano key={fight.start_time} fight={fight} />
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <div className="flex items-baseline gap-2 px-2.5 py-1 rounded-md bg-primary border border-primary-border text-primary-foreground shadow-sm transition-colors duration-300">
                            <span className="text-xs">最远进度</span>
                            {group.isClear && <span className={cn('text-xs font-medium')}>已完成</span>}
                            {!group.isClear && group.phase && group.phase !== 'N/A' && (
                                <span className={cn('text-xs font-medium')}>{group.phase}</span>
                            )}
                            {!group.isClear && (
                                <div className={cn('flex items-baseline gap-1')}>
                                    <span className={cn('text-xs font-semibold text-primary-ring')}>
                                        {(group.enemyHp * 100).toFixed(1)}
                                    </span>
                                    <span className={cn('text-tiny font-medium')}>%</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Players Grid */}
            <PlayerGrid
                players={group.players}
                totalDeaths={group.totalDeaths}
                memberName={memberName}
                memberServer={memberServer}
            />
        </div>
    );
}

export function FightGroup({ groups, memberName, memberServer }: FightGroupProps) {
    return (
        <div className="w-full flex flex-col gap-6">
            {groups.map((group) => (
                <FightGroupItem key={group.key} group={group} memberName={memberName} memberServer={memberServer} />
            ))}
        </div>
    );
}
