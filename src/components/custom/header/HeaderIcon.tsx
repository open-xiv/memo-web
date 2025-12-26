import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import MemoIcon from "@/assets/icon/sumemo.svg?react";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";

export function HeaderIcon() {

    return (
            <Link to={"/"}
                  className={cn(
                          "relative inline-flex h-10 items-center justify-center rounded-lg transition-colors duration-300 pr-2",
                  )}>

                <div className="relative z-20 flex h-full items-center justify-center gap-x-2">
                    <WrapperIcon
                            icon={MemoIcon}
                            className={cn(
                                    "size-8 shrink-0 transition-colors duration-300",
                            )}
                    />
                    <span className={cn(
                            "text-lg font-semibold text-primary-foreground",
                    )}>酥卷</span>
                </div>

            </Link>
    );
}
