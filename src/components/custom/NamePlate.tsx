import type {JobRole} from "@/lib/job.ts";
import {getJobByID} from "@/lib/job.ts";
import type {Player} from "@/types/fight.ts";
import {Link} from "react-router-dom";

interface NamePlateProps {
    player: Player;
}

const getRoleColorClass = (role: JobRole | undefined) => {
    switch (role) {
        case "Tank":
            return {border: "border-blue-500", name: "text-blue-950", server: "text-blue-900"};
        case "Healer":
            return {border: "border-green-500", name: "text-green-950", server: "text-green-900"};
        case "DPS":
            return {border: "border-red-500", name: "text-red-950", server: "text-red-900"};
        default:
            return {border: "border-zinc-500", name: "text-zinc-950", server: "text-zinc-900"};
    }
};

export default function NamePlate({player}: NamePlateProps) {
    const job = getJobByID(player.job_id);
    const jobIcon = job?.iconUrl;
    const colorClasses = getRoleColorClass(job?.role);

    return (
        <Link to={`/member/${player.name}@${player.server}`} className="flex flex-col items-center px-4 py-3 gap-2 relative">
            <div className={`w-full h-full absolute inset-0 bg-zinc-50 rounded-lg border ${colorClasses.border} blur-[1px] z-10`}></div>

            <div className="w-full flex items-center justify-between z-20">
                <div className="flex items-center justify-center gap-1.5">
                    {jobIcon ? (<img src={jobIcon} alt={`job ${player.job_id}`} className="w-6 h-6"/>) : (<div/>)}
                    <div className="flex items-end gap-1 ">
                        <span className={`${colorClasses.name} text-sm font-medium`}>{player.name}</span>
                        <span className={`${colorClasses.server} text-xs font-normal font-mono`}>{player.server}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}