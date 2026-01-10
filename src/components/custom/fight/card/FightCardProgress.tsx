import { cn } from "@/lib/utils.ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { getTextGradient } from "@/lib/gradient.ts";

interface FightCardProgressProps {
    clear: boolean;
    phaseName: string | undefined;
    subphaseName: string | undefined;
    progressHpRemain: number | undefined;
}

export function FightCardProgress({ clear, phaseName, subphaseName, progressHpRemain }: FightCardProgressProps) {
    // progress string for dynamic color
    let progressString = phaseName ? phaseName : `${progressHpRemain}%`;
    progressString = clear ? `已完成` : progressString;

    const enrage = progressHpRemain != undefined && progressHpRemain < 0.1;

    return (
            <div className={`flex gap-x-1 gap-y-1 items-center justify-end`}>

                {/* clear icon */}
                {/*{clear ? (*/}
                {/*        <WrapperIcon icon={VerifiedIcon}*/}
                {/*                     className={cn(*/}
                {/*                             "size-5 shrink-0 transition-colors duration-300",*/}
                {/*                     )}*/}
                {/*                     primary="var(--primary-ring)"*/}
                {/*                     secondary="var(--primary-foreground)"*/}
                {/*        />*/}
                {/*) : (*/}
                {/*        <WrapperIcon icon={SlashIcon}*/}
                {/*                     className={cn(*/}
                {/*                             "size-5 shrink-0 transition-colors duration-300",*/}
                {/*                     )}*/}
                {/*                     primary="var(--secondary-ring)"*/}
                {/*                     secondary="var(--secondary-foreground)"*/}
                {/*        />*/}
                {/*)}*/}

                <Tooltip>
                    <TooltipTrigger asChild>
                        {/* default */}
                        <div className={cn(
                                "flex items-baseline justify-end gap-x-1 transition-colors duration-300 text-secondary-foreground",
                                clear ? "text-primary-foreground" : "text-secondary-foreground", //cn("bg-clip-text text-transparent", getTextGradient(progressString)),
                        )}>
                            {/* Unclear: Progress */}
                            {!clear && !enrage && (
                                    <div className="flex gap-x-0.5 items-baseline">
                                        <span className={cn(
                                                "text-right justify-start text-xs font-medium",
                                        )}>剩余血量</span>
                                        <span className={cn(
                                                "text-right justify-start text-sm font-mono font-semibold",
                                        )}>{progressHpRemain}</span>
                                        <span className={cn(
                                                "text-right justify-start text-xs font-medium",
                                        )}>%</span>
                                    </div>
                            )}
                            {!clear && enrage && (
                                    <div className="flex gap-x-0.5 items-baseline">
                                        <span className={cn(
                                                "text-right justify-start text-sm font-mono font-semibold",
                                        )}>狂暴</span>
                                    </div>
                            )}

                            {/* Clear */}
                            {clear && (
                                    <span className={cn(
                                            "text-right justify-start text-sm font-medium",
                                    )}>已完成</span>
                            )}
                        </div>
                    </TooltipTrigger>

                    {!clear && subphaseName && subphaseName !== "狂暴" && <TooltipContent>
                        <span className={cn(
                                "text-right justify-start text-sm font-medium bg-clip-text text-transparent",
                                getTextGradient(progressString),
                        )}>{subphaseName}</span>
                    </TooltipContent>}
                </Tooltip>

            </div>
    );
}