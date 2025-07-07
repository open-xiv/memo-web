import type {Fight} from "@/types/fight.ts";
import type {Zone} from "@/types/zone.ts";
import {useHeaderContext} from "@/context/HeaderContext.ts";
import {getJobIconByID} from "@/lib/job.ts";
import {useEffect, useState} from "react";
import {getZoneByID} from "@/api";
import {getTimeString} from "@/lib/time.ts";
import {getTextGradient} from "@/lib/gradient.ts";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import NamePlate from "@/components/custom/NamePlate.tsx";
import {Link} from "react-router-dom";

interface FightCardProps {
    fight: Fight;
}

export default function FightCard({fight}: FightCardProps) {
    const {memberName, memberServer} = useHeaderContext();

    const [zone, setZone] = useState<Zone | null>(null);

    // local player job icon
    const localPlayer = (memberName && memberServer
        ? fight.players.find(p => p.name === memberName && p.server === memberServer)
        : fight.players[0]) || null;
    const localJobIcon = localPlayer ? getJobIconByID(localPlayer.job_id) : null;

    // party job icons
    const partyPlayers = fight.players.filter(p => p.id !== localPlayer?.id);
    const partyJobIcons = partyPlayers.map(p => getJobIconByID(p.job_id)).filter(Boolean) as string[];

    // time string
    const timeString = getTimeString(fight.timestamp);

    // fight hash
    const hashString = fight.hash.substring(0, 4);

    // phase
    const currentPhase = zone ? zone.phases.find(p => p.phase_id === fight.progress.phase) : null;
    const currentSubphase = currentPhase ? currentPhase.subphases.find(sp => sp.subphase_id === fight.progress.subphase) : null;
    const phaseName = currentPhase ? currentPhase.name : "";
    const subphaseName = currentSubphase ? `${currentSubphase.name}` : "";

    // progress for dynamic color
    let progressString = `${fight.progress.phase} - ${fight.progress.subphase}`;
    progressString = fight.clear ? `已完成` : progressString;

    // name or alias
    const zoneAlias = zone?.code || zone?.name.split(" ").at(-1) || `Zone ${fight.zone_id}`;

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const zoneData = await getZoneByID(fight.zone_id);
                setZone(zoneData);
            } catch (error) {
                console.error("Error fetching zone data:", error);
                setZone(null);
            }
        };

        fetchZone();
    }, [fight.zone_id]);


    return (
        <div className="w-80 relative flex flex-col items-center p-4 gap-2">
            <div className="w-full h-full absolute inset-0 bg-zinc-50 rounded-lg border border-zinc-500 blur-[2px] z-10"></div>

            {/* local job icon - zone - time */}
            <div className="w-full flex items-center justify-between z-20">
                <div className="flex items-center justify-center gap-2.5">
                    {/* local job icon */}
                    {localJobIcon ? (<img src={localJobIcon} alt={`job ${localPlayer?.job_id}`} className="w-9 h-9"/>) : (<div/>)}
                    {/* zone */}
                    <div className="flex flex-col items-start justify-center gap-0.5 ">
                        <span className="text-zinc-950 text-sm font-medium">{zoneAlias}</span>
                        <span className="text-zinc-400 text-xs font-normal font-mono">#{hashString}</span>
                    </div>
                </div>
                {/* time */}
                <div className="flex flex-col items-end justify-start gap-0.5">
                    <span className="text-zinc-950 text-sm font-medium">{timeString[0]}</span>
                    <span className="text-zinc-400 text-xs font-normal">{timeString[1]}</span>
                </div>
            </div>

            {/*  party job icon - progress  */}
            <div className="w-full flex items-end justify-between z-20">
                {/* party job icons */}
                <div className="flex items-center justify-start gap-1">
                    {partyJobIcons.map((icon, index) => (
                        <div key={index}>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <Link to={`/member/${partyPlayers[index].name}@${partyPlayers[index].server}`} className="flex items-center justify-center">
                                        <img src={icon} alt={`job ${index}`} className="w-6 h-6"/>
                                    </Link>
                                </HoverCardTrigger>
                                <HoverCardContent className={`w-auto h-auto p-0`} sideOffset={12}>
                                    <NamePlate player={partyPlayers[index]}/>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    ))}
                </div>
                {/*  progress  */}
                <div className={`flex flex-wrap gap-x-1 gap-y-1 items-baseline`}>
                    <span className={`text-right justify-start text-sm font-medium ${getTextGradient(progressString)} bg-clip-text text-transparent`}>{phaseName}</span>
                    <span
                        className={`text-right justify-start text-xs font-medium ${getTextGradient(progressString)} bg-clip-text text-transparent`}>{subphaseName}</span>
                </div>
            </div>
        </div>
    );

}

