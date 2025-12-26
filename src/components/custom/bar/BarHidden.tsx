import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import LockIcon from "@/assets/icon/lock.svg?react";

export function BarHidden() {
    return (
            <div className={cn(
                    "relative flex items-center justify-start rounded-lg transition-all duration-300 p-3",
            )}>

                <div
                        className={cn(
                                "absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300",
                                "bg-destructive border-destructive-border",
                        )}
                />

                <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                    <WrapperIcon
                            icon={LockIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary="var(--destructive-ring)"
                            secondary="var(--destructive-foreground)"
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300`}>
                        <span className="text-destructive-foreground font-medium">玩家已将状态设为隐藏</span>
                    </div>
                </div>

            </div>
    );
}