import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import ErrorIcon from "@/assets/icon/error.svg?react";

interface BarErrorProps {
    message: string;
    detail?: string;
}

export function BarError({ message, detail }: BarErrorProps) {
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
                            icon={ErrorIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary="var(--destructive-ring)"
                            secondary="var(--destructive-foreground)"
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300`}>
                        <span className="text-destructive-foreground font-medium">{message}</span>
                        {detail && <span className="text-destructive-ring font-medium">{detail}</span>}
                    </div>
                </div>

            </div>
    );
}