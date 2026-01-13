import type { Fight } from "@/types/fight.ts";
import type { Duty } from "@/types/duty.ts";
import { useHeaderContext } from "@/context/HeaderContext.ts";
import { getJobIconByID, sortPlayersInFight } from "@/lib/job.ts";
import { useEffect, useState } from "react";
import { getDutyByID } from "@/api/sumemo.ts";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card.tsx";
import FightCardNameplate from "@/components/custom/fight/card/FightCardNameplate.tsx";
import { Link } from "react-router-dom";
import { FightCardProgress } from "@/components/custom/fight/card/FightCardProgress.tsx";
import { getTimeRangeString, getTimeString } from "@/lib/time.ts";
import { cn } from "@/lib/utils.ts";

interface FightCardProps {
    fight: Fight;
}

export default function FightCard({ fight }: FightCardProps) {
    const { memberName, memberServer } = useHeaderContext();

    const [duty, setDuty] = useState<Duty | null>(null);

    // sort member by job role
    fight = sortPlayersInFight(fight);

    // local player job icon
    const localPlayer = (memberName && memberServer
            ? fight.players.find(p => p.name === memberName && p.server === memberServer)
            : fight.players[0]) || undefined;
    const localJobIcon = localPlayer ? getJobIconByID(localPlayer.job_id) : undefined;

    // party job icons
    const partyPlayers = fight.players.filter(p => p.name !== localPlayer?.name);
    const partyJobIcons = partyPlayers.map(p => getJobIconByID(p.job_id)).filter(Boolean) as string[];

    // time string
    const timeString = fight.duration > 0 ? getTimeRangeString(fight.start_time, fight.duration) : getTimeString(fight.start_time);

    // fight short comments
    const comments = crypto.randomUUID().slice(0, 4);

    // name or alias
    const zoneAlias = duty?.code || duty?.name.split(" ").at(-1) || `Zone ${fight.zone_id}`;

    useEffect(() => {
        const fetchZone = async () => {
            try {
                const zoneData = await getDutyByID(fight.zone_id);
                setDuty(zoneData);
            } catch (error) {
                console.error("Error fetching zone data:", error);
                setDuty(null);
            }
        };

        void fetchZone();
    }, [fight.zone_id]);

    return (
            <div className="w-80 h-[102px] relative flex flex-col items-center p-4 gap-2">
                <div className="w-full h-full absolute inset-0 bg-card rounded-lg border border-card-border blur-[2px] z-10"></div>

                {/* local job icon - zone - time */}
                <div className="w-full flex items-center justify-between z-20">
                    <div className="flex items-center justify-center gap-2.5">
                        {/* local job icon */}
                        {localJobIcon && <img src={localJobIcon} alt={`job ${localPlayer?.job_id}`} className="w-9 h-9" />}
                        {/* zone */}
                        <div className="flex flex-col items-start justify-center gap-0.5">

                            <div className={`flex gap-0.5 items-center`}>
                                <span className="text-card-foreground text-sm font-medium">{zoneAlias}</span>
                            </div>
                            <span className="text-card-ring text-xs font-normal font-mono">#{comments}</span>
                        </div>

                        {/* death */}
                        {localPlayer?.death_count != undefined && localPlayer.death_count !== 0 && (
                                <div className={cn(
                                        "relative flex items-center justify-center rounded-lg transition-all duration-300 px-2.5 py-1 opacity-80",
                                )}>

                                    <div
                                            className={cn(
                                                    "absolute inset-0 rounded-lg border blur-[1px] transition-all duration-300",
                                                    "bg-secondary border-secondary-border",
                                            )}
                                    />

                                    <div className="relative z-20 flex h-full items-baseline justify-center gap-1 transition-colors duration-300">
                                        <span className="text-secondary-foreground text-sm font-medium">{localPlayer?.death_count}</span>
                                        <span className="text-secondary-ring text-xs font-medium">次倒地</span>
                                    </div>

                                </div>

                        )}
                    </div>

                    {/* time */}
                    <div className="flex flex-col items-end justify-start gap-0.5">
                        <span className="text-card-foreground text-sm font-medium">{timeString[0]}</span>
                        <span className="text-card-ring text-xs font-normal">{timeString[1]}</span>
                    </div>
                </div>

                {/* party job icon - progress  */}
                <div className="w-full flex items-end justify-between z-20">
                    {/* party job icons */}
                    <div className="flex items-center justify-start gap-1">
                        {partyJobIcons.map((icon, index) => (
                                <div key={index}>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <Link to={`/member/${partyPlayers[index].name}@${partyPlayers[index].server}`} className="flex items-center justify-center">
                                                <img src={icon} alt={`job ${index}`} className="w-6 h-6" />
                                            </Link>
                                        </HoverCardTrigger>
                                        <HoverCardContent className={`w-auto h-auto p-0 border-0 bg-transparent shadow-none`} sideOffset={12}>
                                            <FightCardNameplate player={partyPlayers[index]} />
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                        ))}
                    </div>
                    {/* progress */}
                    <FightCardProgress fight={fight} />
                </div>
            </div>
    );
}

