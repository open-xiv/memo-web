import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {getFightByID, getZoneByID} from "@/api";
import {useHeaderContext} from "@/context/HeaderContext";
import DevIcon from "@/assets/icon/dev.svg?react";
import Icon from "@/components/custom/Icon.tsx";

export default function Fight() {
    const {id} = useParams<{ id: string }>();
    const {setZoneInfo} = useHeaderContext();

    useEffect(() => {
        if (!id) {
            // fight ID is not provided
            setZoneInfo(undefined, undefined);
            return;
        }
        const fightIdNumber = Number(id);
        if (isNaN(fightIdNumber)) {
            // invalid fight ID
            setZoneInfo(undefined, undefined);
            return;
        }

        const fetchData = async () => {
            try {
                const fightData = await getFightByID(fightIdNumber);

                if (fightData && fightData.zone_id) {
                    const zoneData = await getZoneByID(fightData.zone_id);
                    setZoneInfo(zoneData.name, fightData.hash);
                } else {
                    setZoneInfo(fightData?.zone_id.toString(), fightData.hash);
                }
            } catch (err) {
                // zone not found
                console.error("error fetching fight or zone data:", err);
                setZoneInfo(undefined, undefined);
            }
        };

        fetchData();

        // clear context when component unmounts
        return () => {
            setZoneInfo(undefined, undefined);
        };
    }, [id, setZoneInfo]);

    return (
        <div className="flex flex-col gap-4">
            {/* Dev Notice */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-amber-50 rounded-lg border border-amber-300 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon icon={DevIcon} className={`h-6 w-6`} primary={`var(--color-amber-400)`} secondary={`var(--color-amber-950)`}/>
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-amber-950 text-base font-medium"> 正在开发中的界面 </span>
                        <span className="text-amber-600 text-base font-medium"> 光子的强大令人震撼 </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
