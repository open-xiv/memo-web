import { getTimeAgo, getTimeString } from '@/lib/time.ts';
import type { FightGroup as FightGroupType } from '@/lib/fight.ts';
import { PlayerGrid } from '@/components/custom/fight/parts/PlayerGrid.tsx';
import { cn } from '@/lib/utils.ts';
import FightNano from '@/components/custom/fight/parts/FightNano.tsx';

interface FightGroupProps {
    groups: FightGroupType[];
    memberName: string;
    memberServer: string;
    showPhase?: boolean;
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
    showPhase?: boolean;
}

function FightGroupItem({ group, memberName, memberServer, showPhase }: FightGroupItemProps) {
    const [date, timeRange] = getTimeRangeDisplay(group.startTime, group.duration);

    return (
        <div className="mx-0.5 flex flex-col gap-3">
            {/* Team Header */}
            <div className="flex flex-wrap items-center justify-start gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-0.5 h-4 bg-accent-amber-strong rounded-full" />
                    <span className="text-sm font-semibold text-on-accent-amber">队伍阵容</span>
                </div>

                <div className={cn('flex gap-2')}>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent-amber border border-accent-amber-border text-on-surface shadow-sm transition-colors duration-300">
                        <div className="flex items-baseline gap-1.5 text-xs">
                            <span className={cn('text-on-accent-amber font-medium')}>
                                {getTimeAgo(group.startTime)}
                            </span>
                            <span className="hidden sm:inline text-on-surface-muted">·</span>
                            <span className="hidden sm:inline text-on-surface-muted">{date}</span>
                            <span className="hidden sm:inline text-on-surface-muted">{timeRange}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-baseline gap-2 px-2 py-1 rounded-md bg-accent-teal border border-accent-teal-border text-on-accent-teal shadow-sm transition-colors duration-300">
                            <span className="text-xs">总场次</span>
                            <span className="text-xs font-medium">{group.fights.length}</span>
                        </div>

                        <div className="flex items-baseline gap-2 px-2.5 py-1 rounded-md bg-accent-pink border border-accent-pink-border text-on-accent-pink shadow-sm transition-colors duration-300">
                            {group.isClear ? (
                                <span className={cn('text-xs font-medium')}>已完成</span>
                            ) : (
                                <>
                                    <span className="text-xs">最远进度</span>
                                    {group.phase && group.phase !== 'N/A' && (
                                        <span className={cn('text-xs font-medium')}>{group.phase}</span>
                                    )}
                                    <div className={cn('flex items-baseline gap-1')}>
                                        <span className={cn('text-xs font-semibold text-accent-pink-strong')}>
                                            {(group.enemyHp * 100).toFixed(1)}
                                        </span>
                                        <span className={cn('text-tiny font-medium')}>%</span>
                                    </div>
                                </>
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

            {/* Per-fight progress cards */}
            <div className="flex flex-wrap gap-2 py-2">
                {group.fights.map((fight) => (
                    <FightNano key={fight.start_time} fight={fight} showPhase={showPhase} />
                ))}
            </div>
        </div>
    );
}

export function FightGroup({ groups, memberName, memberServer, showPhase }: FightGroupProps) {
    return (
        <div className="w-full flex flex-col gap-6">
            {groups.map((group) => (
                <FightGroupItem
                    key={group.key}
                    group={group}
                    memberName={memberName}
                    memberServer={memberServer}
                    showPhase={showPhase}
                />
            ))}
        </div>
    );
}
