import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useHeaderContext} from "@/context/HeaderContext.ts";
import ErrIcon from "@/assets/error.svg?react";
import ZoneProgressRow from "@/components/custom/ZoneProgressRow.tsx";
import GameIcon from "@/assets/gamepad.svg?react";

const ULTIMATES_INTEREST = [1271];
const SAVAGE_INTEREST = [1257, 1259, 1261];

export default function Member() {
    const {name} = useParams();
    const {setMemberInfo} = useHeaderContext();

    const nameParts = name ? name.split("@") : [];
    const playerName = nameParts[0];
    const playerServer = nameParts[1];

    useEffect(() => {
        if (!name) return;
        setMemberInfo(playerName, playerServer);
        return () => setMemberInfo(undefined, undefined);
    }, [name, playerName, playerServer, setMemberInfo]);

    return (
        <div className="flex flex-col gap-6">

            {/* ultimates */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-purple-50 rounded-lg border border-purple-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <GameIcon className="h-6 w-6"/>
                    <div className={`flex flex-wrap gap-x-1 gap-y-1 items-baseline`}>
                        <span className="text-purple-950 font-medium">极神</span>
                        <span className="text-purple-600 font-medium text-xs uppercase">Ultimates</span>
                    </div>
                </div>
            </div>

            {playerName && playerServer ? (
                ULTIMATES_INTEREST.map(zoneID => (
                    <ZoneProgressRow key={zoneID} zoneID={zoneID} playerName={playerName} playerServer={playerServer}/>
                ))
            ) : (
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-red-50 rounded-lg border border-red-300 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <ErrIcon className="h-6 w-6"/>
                        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                            <span className="text-red-950 text-base font-medium">无效信息</span>
                            <span className="text-red-600 text-base font-medium"></span>
                        </div>
                    </div>
                </div>
            )}

            <div/>

            {/* savage */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-purple-50 rounded-lg border border-purple-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <GameIcon className="h-6 w-6"/>
                    <div className={`flex flex-wrap gap-x-1 gap-y-1 items-baseline`}>
                        <span className="text-purple-950 font-medium">零式</span>
                        <span className="text-purple-600 font-medium text-xs uppercase">Savage</span>
                    </div>
                </div>
            </div>

            {playerName && playerServer ? (
                SAVAGE_INTEREST.map(zoneID => (
                    <ZoneProgressRow key={zoneID} zoneID={zoneID} playerName={playerName} playerServer={playerServer}/>
                ))
            ) : (
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-red-50 rounded-lg border border-red-300 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <ErrIcon className="h-6 w-6"/>
                        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                            <span className="text-red-950 text-base font-medium">无效信息</span>
                            <span className="text-red-600 text-base font-medium"></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
