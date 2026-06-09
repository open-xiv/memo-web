import { cn } from '@/lib/utils.ts';
import { useState } from 'react';

export type RaidMode = 'savage' | 'ultimate';

// function BarCategoryIcon() {
//     return (
//             <div className={cn(
//                     "relative flex items-center justify-start rounded-lg transition-all duration-300 p-3",
//             )}>
//
//                 <div
//                         className={cn(
//                                 "absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300",
//                                 "bg-accent-purple border-accent-purple-border",
//                         )}
//                 />
//
//                 <WrapperIcon
//                         icon={GamepadIcon}
//                         className={cn(
//                                 "z-20 size-6 shrink-0 transition-colors duration-300",
//                         )}
//                         primary="var(--accent-purple-strong)"
//                         secondary="var(--on-accent-purple)"
//                 />
//
//             </div>
//     );
// }

interface BarCategorySavageProps {
    isActive: boolean;
    onClick: () => void;
}

function BarCategorySavage({ isActive, onClick }: BarCategorySavageProps) {
    const [isHover, setIsHover] = useState(false);
    const isHighlighted = isActive || isHover;

    return (
        <div className={cn('relative flex items-center justify-start rounded-lg transition-all duration-300 p-3')}>
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-colors duration-300',
                    isHighlighted ? 'border-accent-purple-border bg-accent-purple' : 'border-border-default bg-transparent',
                )}
            />

            <button
                onClick={onClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={cn(
                    'text-sm font-medium transition-colors duration-300 z-20',
                    'flex flex-wrap items-baseline gap-x-2 gap-y-1',
                    isHighlighted ? 'text-on-accent-purple' : 'text-on-surface-muted',
                )}
            >
                <span className="font-medium">零式</span>
                <span
                    className={cn(
                        'text-xs transition-colors duration-300',
                        isHighlighted ? 'text-accent-purple-strong' : 'text-on-surface-muted/50',
                    )}
                >
                    Savage
                </span>
            </button>
        </div>
    );
}

interface BarCategoryUltimateProps {
    isActive: boolean;
    onClick: () => void;
}

function BarCategoryUltimate({ isActive, onClick }: BarCategoryUltimateProps) {
    const [isHover, setIsHover] = useState(false);
    const isHighlighted = isActive || isHover;

    return (
        <div className={cn('relative flex items-center justify-start rounded-lg transition-all duration-300 p-3')}>
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-colors duration-300',
                    isHighlighted ? 'border-accent-purple-border bg-accent-purple' : 'border-border-default bg-transparent',
                )}
            />

            <button
                onClick={onClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={cn(
                    'text-sm font-medium transition-colors duration-300 z-20',
                    'flex flex-wrap items-baseline gap-x-2 gap-y-1',
                    isHighlighted ? 'text-on-accent-purple' : 'text-on-surface-muted',
                )}
            >
                <span className="font-medium">绝境战</span>
                <span
                    className={cn(
                        'text-xs transition-colors duration-300',
                        isHighlighted ? 'text-accent-purple-strong' : 'text-on-surface-muted/50',
                    )}
                >
                    Ultimate
                </span>
            </button>
        </div>
    );
}

interface BarCategoryProps {
    mode: RaidMode;
    setMode: (mode: RaidMode) => void;
}

export function BarCategory({ mode, setMode }: BarCategoryProps) {
    return (
        <div className={cn('flex items-center space-x-2')}>
            {/*<BarCategoryIcon />*/}

            {/* Ultimate */}
            <BarCategoryUltimate isActive={mode === 'ultimate'} onClick={() => setMode('ultimate')} />

            {/* Savage */}
            <BarCategorySavage isActive={mode === 'savage'} onClick={() => setMode('savage')} />
        </div>
    );
}
