import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import VerifiedIcon from "@/assets/icon/verified.svg?react";
import SlashIcon from "@/assets/icon/slash.svg?react";
import { cn } from "@/lib/utils.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { getTextGradient } from "@/lib/gradient.ts";

interface FightCardProgressProps {
    clear: boolean;
    phaseName: string | undefined;
    subphaseName: string | undefined;
    progressPercent: number | undefined;
}

export function FightCardProgress({ clear, phaseName, subphaseName, progressPercent }: FightCardProgressProps) {
    // progress string for dynamic color
    let progressString = phaseName ? phaseName : `${progressPercent}%`;
    progressString = clear ? `已完成` : progressString;

    return (
            <div className={`flex gap-x-1 gap-y-1 items-center justify-end`}>

                {/* clear icon */}
                {clear ? (
                        <WrapperIcon icon={VerifiedIcon}
                                     className={cn(
                                             "size-5 shrink-0 transition-colors duration-300",
                                     )}
                                     primary="var(--primary-ring)"
                                     secondary="var(--primary-foreground)"
                        />
                ) : (
                        <WrapperIcon icon={SlashIcon}
                                     className={cn(
                                             "size-5 shrink-0 transition-colors duration-300",
                                     )}
                                     primary="var(--secondary-ring)"
                                     secondary="var(--secondary-foreground)"
                        />
                )}

                <Tooltip>
                    <TooltipTrigger asChild>
                        {/* default */}
                        <div className={cn(
                                "flex items-baseline justify-end gap-x-1 transition-colors duration-300",
                                clear ? "text-primary-foreground" : cn("bg-clip-text text-transparent", getTextGradient(progressString)),
                        )}>
                            {/* Progress */}
                            {progressPercent && (
                                    <span className={cn(
                                            "text-right justify-start text-sm font-mono font-semibold",
                                    )}>{progressPercent}%</span>
                            )}

                            {/* Phase Name */}
                            {phaseName && (
                                    <span className={cn(
                                            "text-right justify-start text-sm font-medium",
                                    )}>{progressString}</span>
                            )}
                        </div>
                    </TooltipTrigger>

                    {subphaseName && !clear && <TooltipContent>
                        <span className={cn(
                                "text-right justify-start text-sm font-medium bg-clip-text text-transparent",
                                getTextGradient(progressString),
                        )}>{subphaseName}</span>
                    </TooltipContent>}
                </Tooltip>

            </div>
    );
}