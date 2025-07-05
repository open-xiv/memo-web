import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useHeaderContext} from "@/context/HeaderContext.ts";
import ErrIcon from "@/assets/error.svg?react";
import ZoneProgressRow from "@/components/custom/ZoneProgressRow.tsx";

const ZONES_INTEREST = [1271, 1257, 1259, 1261];

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

            {/* Fight Records */}
            {playerName && playerServer ? (
                ZONES_INTEREST.map(zoneID => (
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

            {/* Dev Notice */}
            {/*<div className="w-full relative flex items-center justify-center p-3">*/}
            {/*    <div className="w-full h-full absolute bg-purple-50 rounded-lg border border-purple-300 blur-[2px] z-10"/>*/}
            {/*    <div className="w-full h-full flex items-center justify-start gap-2 z-20">*/}
            {/*        <LockIcon className="h-6 w-6"/>*/}
            {/*        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>*/}
            {/*            <span className="text-purple-950 text-base font-medium">阿卡狄亚零式登天斗技场 中量级</span>*/}
            {/*            <span className="text-purple-600 text-base font-medium">将在下周可用</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}
