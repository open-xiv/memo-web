import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import GamepadIcon from "@/assets/icon/gamepad.svg?react";
import BackwardIcon from "@/assets/icon/backward.svg?react";

export type RaidMode = 'savage' | 'ultimate';

interface BarCategoryProps {
    mode: RaidMode;
    setMode: (mode: RaidMode) => void;
    setHistoryMode?: (state: true | false) => void;
    isHistoryMode?: boolean;
}

export function BarCategory({ mode, setMode, setHistoryMode, isHistoryMode }: BarCategoryProps) {
    return (
        <div className={cn(
            "relative flex items-center justify-start rounded-lg transition-all duration-300 p-3",
        )}>

            <div
                className={cn(
                    "absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300",
                    "bg-category border-category-border",
                )}
            />

            <div className="relative z-20 flex h-full items-center justify-start gap-x-4">
                <WrapperIcon
                    icon={GamepadIcon}
                    className={cn(
                        "size-6 shrink-0 transition-colors duration-300",
                    )}
                    primary="var(--category-ring)"
                    secondary="var(--category-foreground)"
                />

                <div className="flex items-baseline gap-x-3">
                    <button
                        onClick={() => setMode('savage')}
                        className={cn(
                            "text-sm font-medium transition-colors duration-300 hover:text-category-foreground",
                            mode === 'savage' ? "text-category-foreground text-base" : "text-muted-foreground"
                        )}
                    >
                        零式 <span className={cn("text-xs", mode === 'savage' ? "text-category-ring" : "text-muted-foreground/50")}>Savage</span>
                    </button>

                    <div className="h-4 w-[1px] bg-category-border/50" />

                    <button
                        onClick={() => setMode('ultimate')}
                        className={cn(
                            "text-sm font-medium transition-colors duration-300 hover:text-category-foreground",
                            mode === 'ultimate' ? "text-category-foreground text-base" : "text-muted-foreground"
                        )}
                    >
                        绝境战 <span className={cn("text-xs", mode === 'ultimate' ? "text-category-ring" : "text-muted-foreground/50")}>Ultimate</span>
                    </button>
                </div>
            </div>

            {/*sm:block*/}
            {mode === 'savage' && setHistoryMode && (
                <button
                    onClick={() => setHistoryMode(!isHistoryMode)}
                    className={cn(
                        "ml-auto hidden sm:flex items-center gap-x-2 px-3 py-1 rounded-md transition-all duration-300 z-20",
                        "border border-transparent hover:bg-category-border/20",
                        isHistoryMode ? "bg-category-border/20 text-category-foreground" : "text-muted-foreground"
                    )}
                >
                    <WrapperIcon
                        icon={BackwardIcon}
                        className={cn("size-4 transition-transform duration-300", isHistoryMode ? "-rotate-180" : "")}
                        primary={isHistoryMode ? "var(--category-ring)" : "currentColor"}
                        secondary={isHistoryMode ? "var(--category-foreground)" : "currentColor"}
                    />
                    <span className="text-xs font-medium">{ isHistoryMode ? "当前版本" : "历史版本" }</span>
                </button>
            )}

        </div>
    );
}
