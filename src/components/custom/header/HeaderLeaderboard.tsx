import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import RankIcon from '@/assets/icon/barchart.svg?react';
import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import { useState } from 'react';

export function HeaderLeaderboard() {
    const location = useLocation();
    const isActive = location.pathname === '/leaderboard';

    const [isHover, setIsHover] = useState(false);
    const isHighlighted = isActive || isHover;

    return (
        <Link
            to={'/leaderboard'}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={cn(
                'relative inline-flex h-10 items-center justify-center rounded-lg transition-colors duration-300 px-3',
            )}
        >
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-colors duration-300',
                    isHighlighted ? 'border-accent-pink-border bg-accent-pink' : 'border-border-default bg-transparent',
                )}
            />

            <div className="relative z-20 flex h-full items-center justify-center gap-x-2">
                <WrapperIcon
                    icon={RankIcon}
                    className={cn('size-6 shrink-0 transition-colors duration-300')}
                    primary={isHighlighted ? 'var(--accent-pink-strong)' : 'var(--on-accent-amber)'}
                    secondary={isHighlighted ? 'var(--on-accent-pink)' : 'var(--on-surface-muted)'}
                />
            </div>
        </Link>
    );
}
