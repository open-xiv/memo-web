import type { JobRole } from '@/lib/job.ts';
import { getJobByID } from '@/lib/job.ts';
import type { Player } from '@/types/fight.ts';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import DeathIcon from '@/assets/icon/death.svg?react';
import { ANONYMOUS_MODE } from '@/lib/dev.ts';

interface NamePlateProps {
    player: Player;
}

const getRoleColorClass = (role: JobRole | undefined) => {
    switch (role) {
        case 'Tank':
            return {
                border: 'border-role-tank-border',
                bg: 'bg-role-tank',
                name: 'text-on-role-tank',
                server: 'text-role-tank-strong',
            };
        case 'Healer':
            return {
                border: 'border-role-healer-border',
                bg: 'bg-role-healer',
                name: 'text-on-role-healer',
                server: 'text-role-healer-strong',
            };
        case 'DPS':
            return { border: 'border-role-dps-border', bg: 'bg-role-dps', name: 'text-on-role-dps', server: 'text-role-dps-strong' };
        default:
            return {
                border: 'border-surface-muted',
                bg: 'bg-surface-muted',
                name: 'text-on-surface-muted',
                server: 'text-on-surface-muted',
            };
    }
};

export default function FightCardNameplate({ player }: NamePlateProps) {
    const job = getJobByID(player.job_id);
    const jobIcon = job?.iconUrl;
    const colorClasses = getRoleColorClass(job?.role);

    return (
        <div className={cn('flex flex-col items-center justify-center gap-1')}>
            {/* user link */}
            <Link
                to={`/member/${player.name}@${player.server}`}
                className="relative flex items-center justify-start rounded-lg transition-all duration-300 p-3"
            >
                <div
                    className={cn(
                        'absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300',
                        colorClasses.bg,
                        colorClasses.border,
                    )}
                />

                <div className="w-full flex items-center justify-between z-20">
                    <div className="flex items-center justify-center gap-2">
                        {jobIcon ? <img src={jobIcon} alt={`job ${player.job_id}`} className="w-6 h-6" /> : <div />}
                        <div className={cn('flex items-end gap-1', ANONYMOUS_MODE && 'blur-md select-none')}>
                            <span className={cn('text-sm font-medium', colorClasses.name)}>{player.name}</span>
                            <span className={cn('text-xs font-normal font-mono', colorClasses.server)}>
                                {player.server}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* death count */}
            {player.death_count != undefined && player.death_count !== 0 && (
                <div
                    className={cn(
                        'relative flex items-center justify-center rounded-4xl transition-all duration-300 p-3',
                    )}
                >
                    <div
                        className={cn(
                            'absolute inset-0 rounded-4xl border blur-[1px] transition-all duration-300',
                            'bg-accent-amber border-accent-amber-border',
                        )}
                    />

                    <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                        <WrapperIcon
                            icon={DeathIcon}
                            className={cn('size-6 shrink-0 transition-colors duration-300')}
                            primary="var(--accent-amber-strong)"
                            secondary="var(--on-accent-amber)"
                        />
                        <div className={`flex flex-wrap items-baseline gap-1 transition-colors duration-300`}>
                            <span className="text-on-accent-amber font-medium">{player.death_count}</span>
                            <span className="text-accent-amber-strong text-xs font-medium">次倒地</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
