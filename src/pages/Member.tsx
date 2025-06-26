import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import FightCard from "@/components/custom/FightCard";
import type {Fight} from "@/types/fight.ts";
import {getMemberFights} from "@/api";
import {useHeaderContext} from "@/context/HeaderContext.ts";
import DevIcon from "@/assets/dev.svg?react";

export default function Member() {
    const {name} = useParams();
    const {setMemberInfo} = useHeaderContext();

    const [fights, setFights] = useState<Fight[]>([]);

    useEffect(() => {
        if (!name) return;
        // update context
        setMemberInfo(name.split("@")[0], name.split("@")[1]);

        // fetch member fights
        getMemberFights(name)
            .then((data) => {
                setFights(data.fights || []);
            });

        // clear context when component unmounts
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
                    <span className="text-amber-600 text-base font-medium"> 虽然你很急 但你先别急 </span>
                </div>
            </div>

            {/* Fight Records */}
            {fights.length > 0 ?
                <div className="flex flex-wrap justify-start gap-3 w-full">
                    {fights.map((fight) => (
                        <Link key={fight.id} to={`/fight/${fight.id}`} className="block hover:opacity-80 transition-opacity">
                            <FightCard fight={fight}/>
                        </Link>
                    ))}
                </div> : <div/>}
        </div>
    );
}
