import { useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import UserIcon from "@/assets/icon/user.svg?react";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";

export function HeaderMember() {
    const location = useLocation();

    const { player } = useParams<{ player: string }>();
    const isActive = location.pathname.startsWith("/member/");

    const [memberName, memberServer] = isActive && player
            ? player.split("@")
            : [undefined, undefined];

    if (!isActive || !memberName || !memberServer) {
        return null;
    }

    return (
            <div
                    className={cn(
                            "relative inline-flex h-10 items-center justify-center rounded-lg transition-colors duration-300 px-3",
                    )}>

                <div
                        className={cn(
                                "absolute inset-0 rounded-lg border blur-[2px] transition-colors duration-300 border-primary-border bg-primary",
                        )}
                />

                <div className="relative z-20 flex h-full items-center justify-center gap-x-2">
                    <WrapperIcon
                            icon={UserIcon}
                            className={cn(
                                    "size-6 shrink-0 transition-colors duration-300",
                            )}
                            primary="var(--primary-ring)"
                            secondary="var(--primary-foreground)"
                    />

                    <div className={cn(
                            "flex justify-start items-baseline gap-1 text-primary-foreground transition-colors duration-300 max-w-xs overflow-hidden",
                    )}>
                        <div>
                            <span className={`font-medium whitespace-nowrap`}>{memberName}</span>
                            <span className={`text-sm font-medium`}> </span>
                        </div>
                        <span className={`text-xs font-normal whitespace-nowrap`}>{memberServer}</span>
                    </div>
                </div>

            </div>
    );
}
