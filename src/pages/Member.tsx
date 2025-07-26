import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useHeaderContext} from "@/context/HeaderContext.ts";
import ErrIcon from "@/assets/icon/error.svg?react";
import ZoneProgressRow from "@/components/custom/ZoneProgressRow.tsx";
import GameIcon from "@/assets/icon/gamepad.svg?react";
import TargetIcon from "@/assets/icon/target.svg?react";
import LockIcon from "@/assets/icon/lock.svg?react";
import {getMemberHiddenStatus, getTaskStatus, requestSyncLogs} from "@/api/sumemo.ts";
import Icon from "@/components/custom/Icon.tsx";
import {useTheme} from "@/context/ThemeContext.ts";
import Footer from "@/components/custom/Footer.tsx";

const ULTIMATES_INTEREST = [1271];
const SAVAGE_INTEREST = [1257, 1259, 1261, 1263];

export default function Member() {
    const {theme} = useTheme();

    const {name} = useParams();
    const {setMemberInfo} = useHeaderContext();

    const nameParts = name ? name.split("@") : [];
    const playerName = nameParts[0];
    const playerServer = nameParts[1];

    const [isHidden, setIsHidden] = useState<boolean>(false);

    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [taskID, setTaskID] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<string | null>("");

    useEffect(() => {
        const fetchMemberHiddenStatus = async () => {
            try {
                const hidden = await getMemberHiddenStatus(playerName, playerServer);
                setIsHidden(hidden);
            } catch {
                setIsHidden(false);
            }
        };

        fetchMemberHiddenStatus();
    }, [playerName, playerServer]);

    useEffect(() => {
        const handleSync = async () => {
            if (!playerName || !playerServer) return;
            setIsSyncing(true);
            setSyncStatus("正在与 FFLogs 同步");
            try {
                const newTaskID = await requestSyncLogs(playerName, playerServer);
                setTaskID(newTaskID);
            } catch {
                setSyncStatus("同步失败");
                setIsSyncing(false);
            }
        };

        handleSync();
    }, [playerName, playerServer]);

    useEffect(() => {
        if (!taskID) return;

        const interval = setInterval(async () => {
            try {
                const status = await getTaskStatus(taskID);
                setSyncStatus("正在与 FFLogs 同步");
                if (status.startsWith("skip") || status.startsWith("complete")) {
                    clearInterval(interval);
                    setIsSyncing(false);
                    setTaskID(null);
                    if (status.startsWith("complete")) {
                        setSyncStatus("同步完成");
                        window.location.reload();
                    }
                } else if (status.startsWith("fail")) {
                    setSyncStatus("获取状态失败");
                    clearInterval(interval);
                    setIsSyncing(false);
                    setTaskID(null);
                }
            } catch {
                setSyncStatus("获取状态失败");
                clearInterval(interval);
                setIsSyncing(false);
                setTaskID(null);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [taskID]);

    useEffect(() => {
        if (!name) return;
        setMemberInfo(playerName, playerServer);
        return () => setMemberInfo(undefined, undefined);
    }, [name, playerName, playerServer, setMemberInfo]);

    if (isHidden) {
        return (
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-red-50 dark:bg-red-950 rounded-lg border border-red-300 dark:border-red-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={LockIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-red-800" : "--color-red-100"})`}
                        secondary={`var(${theme === "light" ? "--color-red-950" : "--color-red-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-red-950 dark:text-red-200 text-base font-medium">玩家已将状态设为隐藏</span>
                        {/*<span className="text-red-600 dark:text-red-400 text-base font-medium"></span>*/}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">

            {/* sync */}
            {isSyncing &&
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-300 dark:border-amber-700 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <Icon
                            icon={TargetIcon}
                            className={`h-6 w-6`}
                            primary={`var(${theme === "light" ? "--color-amber-400" : "--color-amber-400"})`}
                            secondary={`var(${theme === "light" ? "--color-amber-950" : "--color-amber-200"})`}
                        />
                        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                            <span className="text-amber-950 dark:text-amber-200 text-base font-medium"> {syncStatus} </span>
                            <span className="text-amber-600 dark:text-amber-400 text-base font-medium">  </span>
                        </div>
                    </div>
                </div>
            }

            {/* ultimates */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-300 dark:border-purple-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={GameIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-purple-600" : "--color-purple-400"})`}
                        secondary={`var(${theme === "light" ? "--color-purple-950" : "--color-purple-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-1 gap-y-1 items-baseline`}>
                        <span className="text-purple-950 dark:text-purple-200 font-medium">极神</span>
                        <span className="text-purple-600 dark:text-purple-400 font-medium text-xs uppercase">Ultimates</span>
                    </div>
                </div>
            </div>

            {playerName && playerServer ? (
                ULTIMATES_INTEREST.map(zoneID => (
                    <ZoneProgressRow key={`${playerName}-${playerServer}-${zoneID}`} zoneID={zoneID} playerName={playerName} playerServer={playerServer}/>
                ))
            ) : (
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-red-50 dark:bg-red-950 rounded-lg border border-red-300 dark:border-red-700 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <Icon
                            icon={ErrIcon}
                            className={`h-6 w-6`}
                            primary={`var(${theme === "light" ? "--color-red-400" : "--color-red-400"})`}
                            secondary={`var(${theme === "light" ? "--color-red-950" : "--color-red-200"})`}
                        />
                        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                            <span className="text-red-950 dark:text-red-200 text-base font-medium">无效信息</span>
                            <span className="text-red-600 dark:text-red-400 text-base font-medium"></span>
                        </div>
                    </div>
                </div>
            )}

            <div/>

            {/* savage */}
            <div className="w-full relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-300 dark:border-purple-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={GameIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-purple-600" : "--color-purple-400"})`}
                        secondary={`var(${theme === "light" ? "--color-purple-950" : "--color-purple-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-1 gap-y-1 items-baseline`}>
                        <span className="text-purple-950 dark:text-purple-200 font-medium">零式</span>
                        <span className="text-purple-600 dark:text-purple-400 font-medium text-xs uppercase">Savage</span>
                    </div>
                </div>
            </div>

            {playerName && playerServer ? (
                SAVAGE_INTEREST.map(zoneID => (
                    <ZoneProgressRow key={`${playerName}-${playerServer}-${zoneID}`} zoneID={zoneID} playerName={playerName} playerServer={playerServer}/>
                ))
            ) : (
                <div className="w-full relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-red-50 dark:bg-red-950 rounded-lg border border-red-300 dark:border-red-700 blur-[2px] z-10"/>
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <Icon
                            icon={ErrIcon}
                            className={`h-6 w-6`}
                            primary={`var(${theme === "light" ? "--color-red-400" : "--color-red-400"})`}
                            secondary={`var(${theme === "light" ? "--color-red-950" : "--color-red-200"})`}
                        />
                        <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                            <span className="text-red-950 dark:text-red-200 text-base font-medium">无效信息</span>
                            <span className="text-red-600 dark:text-red-400 text-base font-medium"></span>
                        </div>
                    </div>
                </div>
            )}

            <Footer/>
        </div>
    );
}
