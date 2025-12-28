import type { JobRole } from "@/lib/job.ts";
import { getJobByID } from "@/lib/job.ts";
import type { Player } from "@/types/fight.ts";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import DeathIcon from "@/assets/icon/death.svg?react";

interface NamePlateProps {
    player: Player;
}

const getRoleColorClass = (role: JobRole | undefined) => {

    switch (role) {
        case "Tank":
            return { border: "border-tank-border", bg: "bg-tank", name: "text-tank-foreground", server: "text-tank-ring" };
        case "Healer":
            return { border: "border-healer-border", bg: "bg-healer", name: "text-healer-foreground", server: "text-healer-ring" };
        case "DPS":
            return { border: "border-dps-border", bg: "bg-dps", name: "text-dps-foreground", server: "text-dps-ring" };
        default:
            return { border: "border-muted", bg: "bg-muted", name: "text-muted-foreground", server: "text-muted-foreground" };
    }
};

export default function FightCardNameplate({ player }: NamePlateProps) {
    const job = getJobByID(player.job_id);
    const jobIcon = job?.iconUrl;
    const colorClasses = getRoleColorClass(job?.role);

    return (
            <div className={cn("flex flex-col items-center justify-center gap-1")}>

                {/* user link */}
                <Link
                        to={`/member/${player.name}@${player.server}`}
                        className="relative flex items-center justify-start rounded-lg transition-all duration-300 p-3"
                >
                    <div
                            className={cn(
                                    "absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300",
                                    colorClasses.bg,
                                    colorClasses.border,
                            )}
                    />

                    <div className="w-full flex items-center justify-between z-20">
                        <div className="flex items-center justify-center gap-2">
                            {jobIcon ? (<img src={jobIcon} alt={`job ${player.job_id}`} className="w-6 h-6" />) : (<div />)}
                            <div className="flex items-end gap-1 ">
                            <span className={cn(
                                    "text-sm font-medium",
                                    colorClasses.name,
                            )}>{player.name}</span>
                                <span className={cn(
                                        "text-xs font-normal font-mono",
                                        colorClasses.server,
                                )}>{player.server}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* death count */}
                {player.death_count != undefined && player.death_count !== 0 &&
                        <div className={cn(
                                "relative flex items-center justify-center rounded-4xl transition-all duration-300 p-3",
                        )}>

                            <div
                                    className={cn(
                                            "absolute inset-0 rounded-4xl border blur-[1px] transition-all duration-300",
                                            "bg-secondary border-secondary-border",
                                    )}
                            />

                            <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                                <WrapperIcon
                                        icon={DeathIcon}
                                        className={cn(
                                                "size-6 shrink-0 transition-colors duration-300",
                                        )}
                                        primary="var(--secondary-ring)"
                                        secondary="var(--secondary-foreground)"
                                />
                                <div className={`flex flex-wrap items-baseline gap-1 transition-colors duration-300`}>
                                    <span className="text-secondary-foreground font-medium">{player.death_count}</span>
                                    <span className="text-secondary-ring text-xs font-medium">次倒地</span>
                                </div>
                            </div>

                        </div>
                }

            </div>

    );
}