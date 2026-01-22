import { cn } from '@/lib/utils.ts';
import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import BackwardIcon from '@/assets/icon/backward.svg?react';
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
//                                 "bg-category border-category-border",
//                         )}
//                 />
//
//                 <WrapperIcon
//                         icon={GamepadIcon}
//                         className={cn(
//                                 "z-20 size-6 shrink-0 transition-colors duration-300",
//                         )}
//                         primary="var(--category-ring)"
//                         secondary="var(--category-foreground)"
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
                    isHighlighted ? 'border-category-border bg-category' : 'border-border bg-transparent',
                )}
            />

            <button
                onClick={onClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={cn(
                    'text-sm font-medium transition-colors duration-300 z-20',
                    'flex flex-wrap items-baseline gap-x-2 gap-y-1',
                    isHighlighted ? 'text-category-foreground' : 'text-muted-foreground',
                )}
            >
                <span className="font-medium">零式</span>
                <span
                    className={cn(
                        'text-xs transition-colors duration-300',
                        isHighlighted ? 'text-category-ring' : 'text-muted-foreground/50',
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
                    isHighlighted ? 'border-category-border bg-category' : 'border-border bg-transparent',
                )}
            />

            <button
                onClick={onClick}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                className={cn(
                    'text-sm font-medium transition-colors duration-300 z-20',
                    'flex flex-wrap items-baseline gap-x-2 gap-y-1',
                    isHighlighted ? 'text-category-foreground' : 'text-muted-foreground',
                )}
            >
                <span className="font-medium">绝境战</span>
                <span
                    className={cn(
                        'text-xs transition-colors duration-300',
                        isHighlighted ? 'text-category-ring' : 'text-muted-foreground/50',
                    )}
                >
                    Ultimate
                </span>
            </button>
        </div>
    );
}

interface BarCategoryHistoryProps {
    isHistoryMode?: boolean;
    setHistoryMode: (state: boolean) => void;
}

function BarCategoryHistory({ isHistoryMode, setHistoryMode }: BarCategoryHistoryProps) {
    return (
        <button
            onClick={() => setHistoryMode(!isHistoryMode)}
            className={cn(
                'ml-auto hidden items-center gap-x-2 px-3 py-1 rounded-md transition-all duration-300 z-20',
                'border border-transparent hover:bg-category-border/20',
                isHistoryMode ? 'bg-category-border/20 text-category-foreground' : 'text-muted-foreground',
            )}
        >
            <WrapperIcon
                icon={BackwardIcon}
                className={cn('size-4 transition-transform duration-300', isHistoryMode ? '-rotate-180' : '')}
                primary={isHistoryMode ? 'var(--category-ring)' : 'currentColor'}
                secondary={isHistoryMode ? 'var(--category-foreground)' : 'currentColor'}
            />
            <span className="text-xs font-medium">{isHistoryMode ? '当前版本' : '历史版本'}</span>
        </button>
    );
}

interface BarCategoryProps {
    mode: RaidMode;
    setMode: (mode: RaidMode) => void;
    setHistoryMode?: (state: true | false) => void;
    isHistoryMode?: boolean;
}

export function BarCategory({ mode, setMode, setHistoryMode, isHistoryMode }: BarCategoryProps) {
    return (
        <div className={cn('flex items-center space-x-2')}>
            {/*<BarCategoryIcon />*/}

            {/* Savage */}
            <BarCategorySavage isActive={mode === 'savage'} onClick={() => setMode('savage')} />

            {/* Ultimate */}
            <BarCategoryUltimate isActive={mode === 'ultimate'} onClick={() => setMode('ultimate')} />

            {/* History Mode Toggle */}
            {setHistoryMode && isHistoryMode !== undefined && (
                <BarCategoryHistory isHistoryMode={isHistoryMode} setHistoryMode={setHistoryMode} />
            )}
        </div>
    );
}
