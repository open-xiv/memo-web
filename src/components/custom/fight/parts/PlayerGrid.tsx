import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import { getJobIconByID } from '@/lib/job.ts';
import type { Player } from '@/types/fight.ts';
import { useMemo } from 'react';
import { Crown } from 'lucide-react';
import { ANONYMOUS_MODE } from '@/lib/dev.ts';

interface PlayerCardProps {
    player: Player;
    deathCount: number;
    isCurrentMember: boolean;
    maxDeaths: number;
    maxDeathCount: number;
}

function PlayerCard({ player, deathCount, isCurrentMember, maxDeaths, maxDeathCount }: PlayerCardProps) {
    const playerSlub = `${player.name}@${player.server}`;

    const icon = getJobIconByID(player.job_id);

    const isDeathKing = deathCount === maxDeaths && maxDeaths > 0 && maxDeathCount <= 2;

    return (
        <Link
            to={`/member/${playerSlub}`}
            className={cn(
                'group relative flex w-full sm:w-60 items-center justify-center rounded-lg transition-colors duration-300 px-3',
            )}
        >
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300 z-10',
                    isCurrentMember
                        ? 'border-accent-pink-strong bg-accent-pink'
                        : 'border-border-default bg-transparent group-hover:border-accent-amber-border group-hover:bg-accent-amber',
                )}
            />

            <div className="relative z-20 flex items-center gap-3 w-full py-2">
                {/* Job Icon */}
                {icon && <img src={icon} alt={player.name} className="w-8 h-8 shrink-0" />}

                {/* Name & Server */}
                <div
                    className={cn(
                        'flex flex-col items-start justify-center min-w-0 flex-1',
                        ANONYMOUS_MODE && 'blur-md select-none',
                    )}
                >
                    <span
                        className={cn(
                            'text-sm font-medium truncate w-full',
                            isCurrentMember ? 'text-accent-pink-strong' : 'text-on-surface-card',
                        )}
                    >
                        {player.name}
                    </span>

                    <span
                        className={cn(
                            'text-tiny font-mono truncate w-full',
                            isCurrentMember ? 'text-accent-pink-strong' : 'text-on-surface-muted',
                        )}
                    >
                        {player.server}
                    </span>
                </div>

                {/* Death Count — hidden on phones (2-col layout has no room) */}
                {deathCount > 0 && (
                    <div className={cn('hidden sm:flex items-center gap-1.5')}>
                        {isDeathKing && <Crown className="size-4 text-on-accent-amber fill-current" />}

                        <div
                            className={cn(
                                'relative flex items-center justify-center rounded-lg transition-all duration-300 px-2.5 py-1 opacity-80',
                            )}
                        >
                            <div
                                className={cn(
                                    'absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300',
                                    'bg-accent-amber border-accent-amber-border',
                                )}
                            />

                            <div className="relative z-20 flex h-full items-baseline justify-center gap-1 transition-colors duration-300">
                                <span className="text-on-accent-amber text-sm font-medium">{deathCount}</span>
                                <span className="text-accent-amber-strong text-xs font-medium">次倒地</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}

interface PlayerGridProps {
    players: Player[];
    totalDeaths: Record<string, number>;
    memberName: string;
    memberServer: string;
}

export function PlayerGrid({ players, totalDeaths, memberName, memberServer }: PlayerGridProps) {
    const { maxDeaths, maxDeathCount } = useMemo(() => {
        const allDeaths = Object.values(totalDeaths);
        const max = Math.max(...allDeaths);
        return { maxDeaths: max, maxDeathCount: allDeaths.filter((d) => d === max).length };
    }, [totalDeaths]);

    return (
        <div className="w-full sm:w-fit grid grid-cols-2 lg:grid-cols-4 gap-3 py-2 transition-colors duration-300 items-start justify-items-start">
            {players.map((player) => {
                const playerSlub = `${player.name}@${player.server}`;
                const deaths = totalDeaths[playerSlub] || 0;
                const isCurrentMember = player.name === memberName && player.server === memberServer;

                return (
                    <PlayerCard
                        key={playerSlub}
                        player={player}
                        deathCount={deaths}
                        isCurrentMember={isCurrentMember}
                        maxDeaths={maxDeaths}
                        maxDeathCount={maxDeathCount}
                    />
                );
            })}
        </div>
    );
}
