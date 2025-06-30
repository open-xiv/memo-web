import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import FightCard from "@/components/custom/FightCard";
import type {Fight} from "@/types/fight.ts";
import {getFightByID, getMemberZoneProgress} from "@/api";
import {useHeaderContext} from "@/context/HeaderContext.ts";
import DevIcon from "@/assets/dev.svg?react";
import ErrIcon from "@/assets/error.svg?react";
import TargetIcon from "@/assets/target.svg?react";

const ZONES_INTEREST = [1271];

export default function Member() {
    const {name} = useParams();
    const {setMemberInfo} = useHeaderContext();

    const [fights, setFights] = useState<Fight[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!name) {
            return;
        }

        setIsLoading(true);

        // update header context with member info
        const nameParts = name.split("@");
        setMemberInfo(nameParts[0], nameParts[1]);

        // fetch member's best fights
        const fetchBestFights = async () => {
            try {
                const encodedName = encodeURIComponent(nameParts[0]) + "@" + encodeURIComponent(nameParts[1]);
                
                // fetch all interest zones
                const progressPromises = ZONES_INTEREST.map(zoneId =>
                    getMemberZoneProgress(encodedName, zoneId)
                );
                const progressResults = await Promise.all(progressPromises);

                // filter valid fights
                const validFightIds = progressResults
                    .map(p => p.fight_id)
                    .filter((id): id is number => id !== undefined && id !== 0);

                if (validFightIds.length === 0) {
                    setFights([]);
                    return;
                }

                // fetch fight details
                const fightPromises = validFightIds.map(id => getFightByID(id));
                const bestFightsData = await Promise.all(fightPromises);

                // update fight data
                setFights(bestFightsData);

            } catch (error) {
                console.error("Failed to fetch member's best fights:", error);
                setFights([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBestFights();

        // cleanup function to reset member info
        return () => {
            setMemberInfo(undefined, undefined);
        };
    }, [name, setMemberInfo]);

    return (
        <div className="flex flex-col gap-4">
            {/* Dev Notice */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <DevIcon className="h-6 w-6"/>
                    <span className="text-amber-950 text-base font-medium"> 正在开发中的界面 </span>
                    <span className="text-amber-600 text-base font-medium"> 别急 </span>
                </div>
            </div>

            {/* Fight Records */}
            {isLoading ?
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <TargetIcon className="h-6 w-6"/>
                        <span className="text-amber-950 text-base font-medium"> 数据加载中 </span>
                        <span className="text-amber-600 text-base font-medium"> 别急 </span>
                    </div>
                </div>
                : fights.length > 0 ?
                    <div className="flex flex-wrap justify-start gap-3 w-full">
                        {fights.map((fight) => (
                            <FightCard key={fight.id} fight={fight}/>
                        ))}
                    </div>
                    :
                    <div className="w-full relative flex items-center justify-center p-3">
                        <div
                            className="w-full h-full absolute bg-red-50 rounded-lg border border-red-300 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <ErrIcon className="h-6 w-6"/>
                            <span className="text-red-950 text-base font-medium"> 无有效记录 </span>
                            <span className="text-red-600 text-base font-medium"> 和我的钱包一样空 </span>
                        </div>
                    </div>
            }
        </div>
    );
}
