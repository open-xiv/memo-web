import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import HelpIcon from "@/assets/icon/heart2heart.svg?react";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import { useState } from "react";

export function HeaderHelp() {
    const location = useLocation();
    const isActive = location.pathname === "/help";

    const [isHover, setIsHover] = useState(false);
    const isHighlighted = isActive || isHover;

    return (
            <Link to={"/help"}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className={cn(
                          "relative inline-flex h-10 items-center justify-center rounded-lg transition-colors duration-300 px-3",
                  )}>

                <div
                        className={cn(
                                "absolute inset-0 rounded-lg border blur-[2px] transition-colors duration-300",
                                isHighlighted
                                        ? "border-primary-border bg-primary"
                                        : "border-border bg-transparent",
                        )}
                />

                <div className="relative z-20 flex h-full items-center justify-center gap-x-2">
                    <WrapperIcon
                            icon={HelpIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary={isHighlighted ? "var(--primary-ring)" : "var(--secondary-foreground)"}
                            secondary={isHighlighted ? "var(--primary-foreground)" : "var(--muted-foreground)"}
                    />
                </div>

            </Link>
    );
}
