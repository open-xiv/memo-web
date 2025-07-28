import {useEffect, useState} from "react";
import {getServerStats} from "@/api/sumemo.ts";
import {useTheme} from "@/context/ThemeContext.ts";
import Icon from "@/components/custom/Icon.tsx";
import BoxIcon from "@/assets/icon/box.svg?react";
import MemberIcon from "@/assets/icon/member.svg?react";
import type {Stats} from "@/types/stats.ts";


export function Stats() {
    const {theme} = useTheme();

    const [statsData, setStatsData] = useState<Stats>();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getServerStats();
                setStatsData(stats);
            } catch {
                setStatsData(undefined);
            }
        };

        fetchStats();
    }, []);

    if (statsData) {
        return (
            <div className={`w-full flex flex-col gap-4 flex-wrap`}>

                {/* Overall */}
                <div className={`mx-0.5 flex justify-start gap-2`}>
                    <div className={`w-0.5 bg-red-400 dark:bg-red-500`}/>
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
                        <span className="text-red-950 dark:text-red-200 text-base font-medium"> 数据统计 </span>
                        {/*<span className="text-red-800 dark:text-red-300 text-sm font-medium"> 最远进度 </span>*/}
                    </div>
                </div>
                <div className={`w-full flex gap-2 flex-wrap`}>
                    {/* Fights */}
                    <div className="w-full sm:w-fit relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute bg-sky-50 dark:bg-sky-950 rounded-lg border border-sky-300 dark:border-sky-700 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <Icon
                                icon={BoxIcon}
                                className={`h-6 w-6`}
                                primary={`var(${theme === "light" ? "--color-sky-100" : "--color-sky-900"})`}
                                secondary={`var(${theme === "light" ? "--color-sky-950" : "--color-sky-200"})`}
                            />
                            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
                                <span className="text-sky-950 dark:text-sky-200 text-base font-medium"> 已记录战斗 </span>
                                <span className="text-sky-600 dark:text-sky-400 text-base font-medium font-mono"> {Math.trunc(statsData?.fights / 1e4)} </span>
                                <span className="text-sky-950 dark:text-sky-200 text-xs font-medium pr-1"> 万条 </span>
                            </div>
                        </div>
                    </div>

                    {/* Players */}
                    <div className="w-full sm:w-fit relative flex items-center justify-center p-3">
                        <div
                            className="w-full h-full absolute bg-amber-50 dark:bg-amber-950/70 rounded-lg border border-amber-300 dark:border-amber-700 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <Icon
                                icon={MemberIcon}
                                className={`h-6 w-6`}
                                primary={`var(${theme === "light" ? "--color-amber-900" : "--color-amber-200"})`}
                                secondary={`var(${theme === "light" ? "--color-amber-950" : "--color-amber-400"})`}
                            />
                            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
                                <span className="text-amber-950 dark:text-amber-200 text-base font-medium"> 已覆盖玩家 </span>
                                <span className="text-amber-600 dark:text-amber-400 text-base font-medium font-mono"> {Math.trunc(statsData?.member / 1e4)} </span>
                                <span className="text-amber-950 dark:text-amber-200 text-xs font-medium pr-1"> 万名 </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client */}
                <div className={`mx-0.5 flex justify-start gap-2`}>
                    <div className={`w-0.5 bg-indigo-400 dark:bg-indigo-500`}/>
                    <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
                        <span className="text-indigo-950 dark:text-indigo-200 text-base font-medium"> 数据来源 </span>
                    </div>
                </div>
                <div className="w-full h-fit sm:w-full rounded flex gap-x-2">
                    {/* From DR */}
                    <a href={"https://discord.gg/MDvv8Ejntw"} className="w-full sm:w-fit relative flex items-center justify-center p-3"
                       style={{width: `${(statsData?.fights - statsData.log_only_fights) / statsData.fights * 100}%`}}>
                        <div className="w-full h-full absolute bg-teal-50 dark:bg-teal-950 rounded-lg border border-teal-300 dark:border-teal-700 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-center gap-2 z-20">
                            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline px-2`}>
                                <div className="text-teal-950 dark:text-teal-200 text-sm font-medium"> Daily Routines</div>
                                <span
                                    className="text-teal-600 dark:text-teal-400 text-sm font-medium font-mono"> {Math.trunc((statsData?.fights - statsData.log_only_fights) / 1e4)} </span>
                                <span className="text-teal-950 dark:text-teal-200 text-xs font-medium"> 万条 </span>
                            </div>
                        </div>
                    </a>

                    {/* From FFLogs */}
                    <a href={`https://fflogs.com`} className="w-full sm:w-fit relative flex items-center justify-center p-3"
                       style={{width: `${(statsData.log_only_fights) / statsData.fights * 100}%`}}>
                        <div className="w-full h-full absolute bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-500 blur-[2px] z-10"/>
                        <div className="w-full h-full flex items-center justify-center gap-2 z-20">
                            <div className={`hidden sm:flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline px-2`}>
                                <div className="text-zinc-950 dark:text-zinc-200 text-sm font-medium"> FFLogs</div>
                            </div>
                        </div>
                    </a>
                </div>
                
            </div>
        );
    }

    return;
}
