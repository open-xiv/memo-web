import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import TargetIcon from "@/assets/icon/target.svg?react";

interface BarLoadingProps {
    message: string;
    detail?: string;
}

export function BarLoading({ message, detail }: BarLoadingProps) {
    return (
            <div className={cn(
                    "relative flex items-center justify-start rounded-lg transition-all duration-300 p-3",
            )}>

                <div
                        className={cn(
                                "absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300",
                                "bg-secondary border-secondary-border",
                        )}
                />

                <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                    <WrapperIcon
                            icon={TargetIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary="var(--secondary-ring)"
                            secondary="var(--secondary-foreground)"
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300`}>
                        <span className="text-secondary-foreground font-medium">{message}</span>
                        {detail && <span className="text-secondary-ring font-medium">{detail}</span>}
                    </div>
                </div>

            </div>
    );
}