import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import FightIcon from "@/assets/icon/fight.svg?react";
import ToggleExpand from "@/components/custom/toggle/ToggleExpand.tsx";

interface BarZoneProps {
    message: string;
    detail?: string;
    setExpand: (state: "min" | "max") => void;
}

export function BarZone({ message, detail, setExpand }: BarZoneProps) {
    return (
            <div className={cn(
                    "w-full lg:w-2/5",
                    "relative flex items-center justify-start rounded-lg transition-all duration-300 p-3",
            )}>

                <div
                        className={cn(
                                "absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300",
                                "bg-zone border-zone-border",
                        )}
                />

                <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                    <WrapperIcon
                            icon={FightIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary="var(--zone-ring)"
                            secondary="var(--zone-foreground)"
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300`}>
                        <span className="text-zone-foreground font-medium">{message}</span>
                        {detail && <span className="text-zone-ring font-medium">{detail}</span>}
                    </div>
                </div>

                <div className={cn("ml-auto hidden sm:block")}>
                    <ToggleExpand setExpand={setExpand} />
                </div>

            </div>
    );
}