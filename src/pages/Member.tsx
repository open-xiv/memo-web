import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHeaderContext } from "@/context/HeaderContext.ts";
import FightDuty from "@/components/custom/fight/FightDuty.tsx";
import { getMemberHiddenStatus } from "@/api/sumemo.ts";
import { BarHidden } from "@/components/custom/bar/BarHidden.tsx";
import { BarError } from "@/components/custom/bar/BarError.tsx";
import { BarSavage } from "@/components/custom/bar/BarSavage";
import { BarLoading } from "@/components/custom/bar/BarLoading.tsx";

const SAVAGE_NAME = { cn: "零式", en: "Savage" };
const SAVAGE_INTEREST = [1321, 1323, 1325, 1327];
const SAVAGE_PAST_INTEREST = [1257, 1259, 1261, 1263];

export default function Member() {
    const { name } = useParams();
    const { setMemberInfo } = useHeaderContext();

    const { player } = useParams<{ player: string }>();
    const [memberName, memberServer] = player
            ? player.split("@")
            : [undefined, undefined];

    const [isHidden, setIsHidden] = useState<boolean>(false);

    const [isHistoryMode, setIsHistoryMode] = useState<true | false>(false);
    const interest = isHistoryMode ? SAVAGE_PAST_INTEREST : SAVAGE_INTEREST;

    useEffect(() => {
        const fetchMemberHiddenStatus = async () => {
            try {
                if (!memberName || !memberServer) {
                    setIsHidden(false);
                    return;
                }
                const hidden = await getMemberHiddenStatus(memberName, memberServer);
                setIsHidden(hidden);
            } catch {
                setIsHidden(false);
            }
        };

        void fetchMemberHiddenStatus();
    }, [memberName, memberServer]);

    useEffect(() => {
        if (!name || !memberName || !memberServer) {
            return;
        }
        setMemberInfo(memberName, memberServer);
        return () => setMemberInfo(undefined, undefined);
    }, [name, memberName, memberServer, setMemberInfo]);

    if (isHidden) {
        return (<BarHidden />);
    }

    return (
            <div className="flex flex-col gap-6">

                {/* savage */}
                <BarSavage message={SAVAGE_NAME.cn} detail={SAVAGE_NAME.en} setHistoryMode={setIsHistoryMode} />

                {/* Dev */}
                {!isHistoryMode && <BarLoading message={`重量级 首周 仅提供粗粒度支持`} detail={`时长 & 血量进度`} />}

                {/* savage zones */}
                {
                    memberName && memberServer ? (
                            interest.map(zoneID => (
                                    <FightDuty key={`${memberName}-${memberServer}-${zoneID}`}
                                               zoneID={zoneID}
                                               memberName={memberName} memberServer={memberServer}
                                    />
                            ))
                    ) : (
                            <BarError message="无效信息" />
                    )
                }
            </div>
    );
}