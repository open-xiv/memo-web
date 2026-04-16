import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHeaderContext } from '@/context/HeaderContext.ts';
import { getMemberOverview } from '@/api/sumemo.ts';
import { BarHidden } from '@/components/custom/bar/BarHidden.tsx';
import { BarError } from '@/components/custom/bar/BarError.tsx';
import { BarCategory, type RaidMode } from '@/components/custom/bar/BarCategory.tsx';
import { BarContribution } from '@/components/custom/bar/BarContribution.tsx';
import { FightOverview } from '@/components/custom/fight/layout/FightOverview.tsx';
import { FightDetail } from '@/components/custom/fight/layout/FightDetail.tsx';
import type { MemberOverview } from '@/types/member.ts';

const SAVAGE_INTEREST = [1321, 1323, 1325, 1327];
const SAVAGE_PAST_INTEREST = [1257, 1259, 1261, 1263];

const ULTIMATE_INTEREST = [777];

export default function Member() {
    const { setMemberInfo } = useHeaderContext();

    const { player } = useParams<{ player: string }>();
    const [memberName, memberServer] = player ? player.split('@') : [undefined, undefined];

    const [isHidden, setIsHidden] = useState<boolean>(false);
    const [overview, setOverview] = useState<MemberOverview | null>(null);

    const [mode, setMode] = useState<RaidMode>('savage');
    const [isHistoryMode, setIsHistoryMode] = useState<true | false>(false);
    const [selectedZone, setSelectedZone] = useState<number | null>(null);

    let interest: number[];
    if (mode === 'savage') {
        interest = isHistoryMode ? SAVAGE_PAST_INTEREST : SAVAGE_INTEREST;
    } else {
        interest = ULTIMATE_INTEREST;
    }

    // Reset selected zone when switching modes
    useEffect(() => {
        setSelectedZone(null);
    }, [mode, isHistoryMode]);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                if (!memberName || !memberServer) {
                    setIsHidden(false);
                    setOverview(null);
                    return;
                }
                const data = await getMemberOverview(memberName, memberServer);
                setOverview(data);
                setIsHidden(false);
            } catch (err: unknown) {
                setOverview(null);
                // 404 means hidden or not found
                if (err && typeof err === 'object' && 'response' in err) {
                    const response = (err as { response: { status: number } }).response;
                    if (response?.status === 404) {
                        setIsHidden(true);
                        return;
                    }
                }
                setIsHidden(false);
            }
        };

        void fetchOverview();
    }, [memberName, memberServer]);

    useEffect(() => {
        if (!player || !memberName || !memberServer) {
            return;
        }
        setMemberInfo(memberName, memberServer);
        return () => setMemberInfo(undefined, undefined);
    }, [player, memberName, memberServer, setMemberInfo]);

    if (isHidden) {
        return <BarHidden />;
    }

    const selectedDuty = selectedZone ? overview?.zones[String(selectedZone)]?.duty : undefined;

    return (
        <div className="flex flex-col gap-6">
            {/* Category Selector */}
            <BarCategory
                mode={mode}
                setMode={setMode}
                setHistoryMode={setIsHistoryMode}
                isHistoryMode={isHistoryMode}
            />

            {/* Contribute */}
            <BarContribution />

            {/* zones */}
            {memberName && memberServer && overview ? (
                <>
                    <FightOverview
                        overview={overview}
                        interest={interest}
                        selectedZone={selectedZone}
                        onSelectZone={setSelectedZone}
                    />

                    {selectedZone && (
                        <FightDetail
                            key={`${memberName}-${memberServer}-${selectedZone}`}
                            zoneID={selectedZone}
                            memberName={memberName}
                            memberServer={memberServer}
                            duty={selectedDuty}
                        />
                    )}
                </>
            ) : memberName && memberServer ? null : (
                <BarError message="无效信息" />
            )}
        </div>
    );
}
