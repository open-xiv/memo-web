import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHeaderContext } from "@/context/HeaderContext.ts";
import FightDuty from "@/components/custom/fight/FightDuty.tsx";
import { getMemberHiddenStatus } from "@/api/sumemo.ts";
import { BarHidden } from "@/components/custom/bar/BarHidden.tsx";
import { BarError } from "@/components/custom/bar/BarError.tsx";
import { BarCategory, type RaidMode } from "@/components/custom/bar/BarCategory.tsx";
import { BarLoading } from "@/components/custom/bar/BarLoading.tsx";
import { BarContribution } from "@/components/custom/bar/BarContribution.tsx";

const SAVAGE_INTEREST = [1321, 1323, 1325, 1327];
const SAVAGE_PAST_INTEREST = [1257, 1259, 1261, 1263];

const ULTIMATE_INTEREST = [777];

export default function Member() {
    const { setMemberInfo } = useHeaderContext();

    const { player } = useParams<{ player: string }>();
    const [memberName, memberServer] = player
            ? player.split("@")
            : [undefined, undefined];

    const [isHidden, setIsHidden] = useState<boolean>(false);

    const [mode, setMode] = useState<RaidMode>('savage');
    const [isHistoryMode, setIsHistoryMode] = useState<true | false>(false);
    
    let interest: number[] = [];
    if (mode === 'savage') {
        interest = isHistoryMode ? SAVAGE_PAST_INTEREST : SAVAGE_INTEREST;
    } else {
        interest = ULTIMATE_INTEREST;
    }

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
        if (!player || !memberName || !memberServer) {
            return;
        }
        setMemberInfo(memberName, memberServer);
        return () => setMemberInfo(undefined, undefined);
    }, [player, memberName, memberServer, setMemberInfo]);

    if (isHidden) {
        return (<BarHidden />);
    }

    return (
            <div className="flex flex-col gap-6">

                {/* Category Selector */}
                <BarCategory mode={mode} setMode={setMode} setHistoryMode={setIsHistoryMode} isHistoryMode={isHistoryMode} />

                {/* Contribute */}
                <BarContribution
                        message="欢迎向我们贡献各类副本时间轴、机制等信息。"
                        linkText="点击跳转"
                        linkUrl="https://github.com/open-xiv/assets/tree/main/duty"
                />

                {/* Dev */}
                {mode === 'savage' && !isHistoryMode && <BarLoading message={`重量级 首周 仅提供粗粒度支持`} detail={`时长 & 血量进度`} />}

                {/* zones */}
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