import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import HeartIcon from "@/assets/icon/heart.svg?react";
import LinkIcon from "@/assets/icon/link.svg?react";

interface BarContributionProps {
    message: string;
    linkText: string;
    linkUrl: string;
}

export function BarContribution({ message, linkText, linkUrl }: BarContributionProps) {
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

                <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                    <WrapperIcon
                            icon={HeartIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary="var(--category-ring)"
                            secondary="var(--category)"
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300 items-baseline`}>
                        <span className="text-category-foreground font-medium">{message}</span>
                        <a
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-category-ring font-medium hover:underline flex items-center gap-1 group transition-colors duration-300"
                        >
                            <span>{linkText}</span>
                            <LinkIcon className="size-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>

            </div>
    );
}
