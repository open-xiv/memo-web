// import { useEffect, useMemo, useState } from "react";
// import { getServerStats } from "@/api/sumemo.ts";
// import { useTheme } from "@/context/ThemeContext.ts";
// import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
// import BoxIcon from "@/assets/icon/box.svg?react";
// import MemberIcon from "@/assets/icon/member.svg?react";
// import type { Stats } from "@/types/stats.ts";
//
//
// export function Stats() {
//     const { theme } = useTheme();
//
//     const [statsData, setStatsData] = useState<Stats>();
//
//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const stats = await getServerStats();
//                 setStatsData(stats);
//             } catch {
//                 setStatsData(undefined);
//             }
//         };
//
//         fetchStats();
//     }, []);
//
//     const totalFights = useMemo(() => {
//         return Array.isArray(statsData?.fight)
//                 ? statsData.fight.reduce((sum, current) => sum + current.count, 0)
//                 : 0;
//     }, [statsData]);
//
//     const { drFights, fuFights, logsFights } = useMemo(() => {
//         const counts = {
//             drFights: 0,
//             fuFights: 0,
//             logsFights: 0,
//         };
//
//         if (Array.isArray(statsData?.fight)) {
//             for (const f of statsData.fight) {
//                 switch (f.source) {
//                     case "Daily Routines":
//                         counts.drFights = f.count;
//                         break;
//                     case "FuckAnimationLock":
//                         counts.fuFights = f.count;
//                         break;
//                     case "FFLogs":
//                         counts.logsFights = f.count;
//                         break;
//                 }
//             }
//         }
//
//         return counts;
//     }, [statsData]);
//
//     if (statsData && totalFights > 0) {
//         return (
//                 <div className={`w-full flex flex-col gap-4 flex-wrap`}>
//
//                     {/* Overall */}
//                     <div className={`mx-0.5 flex justify-start gap-2`}>
//                         <div className={`w-0.5 bg-red-400 dark:bg-red-500`} />
//                         <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
//                             <span className="text-red-950 dark:text-red-200 text-base font-medium"> 数据统计 </span>
//                             {/*<span className="text-red-800 dark:text-red-300 text-sm font-medium"> 最远进度 </span>*/}
//                         </div>
//                     </div>
//                     <div className={`w-full flex gap-2 flex-wrap`}>
//                         {/* Fights */}
//                         <div className="w-full sm:w-fit relative flex items-center justify-center p-3">
//                             <div className="w-full h-full absolute bg-sky-50 dark:bg-sky-950 rounded-lg border border-sky-300 dark:border-sky-700 blur-[2px] z-10" />
//                             <div className="w-full h-full flex items-center justify-start gap-2 z-20">
//                                 <WrapperIcon
//                                         icon={BoxIcon}
//                                         className={`size-6`}
//                                         primary={`var(${theme === "light" ? "--color-sky-100" : "--color-sky-900"})`}
//                                         secondary={`var(${theme === "light" ? "--color-sky-950" : "--color-sky-200"})`}
//                                 />
//                                 <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
//                                     <span className="text-sky-950 dark:text-sky-200 text-base font-medium"> 已记录战斗 </span>
//                                     <span className="text-sky-600 dark:text-sky-400 text-base font-medium font-mono"> {Math.trunc(totalFights / 1e4)} </span>
//                                     <span className="text-sky-950 dark:text-sky-200 text-xs font-medium pr-1"> 万条 </span>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Players */}
//                         <div className="w-full sm:w-fit relative flex items-center justify-center p-3">
//                             <div
//                                     className="w-full h-full absolute bg-amber-50 dark:bg-amber-950/70 rounded-lg border border-amber-300 dark:border-amber-700 blur-[2px] z-10" />
//                             <div className="w-full h-full flex items-center justify-start gap-2 z-20">
//                                 <WrapperIcon
//                                         icon={MemberIcon}
//                                         className={`size-6`}
//                                         primary={`var(${theme === "light" ? "--color-amber-900" : "--color-amber-200"})`}
//                                         secondary={`var(${theme === "light" ? "--color-amber-950" : "--color-amber-400"})`}
//                                 />
//                                 <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
//                                     <span className="text-amber-950 dark:text-amber-200 text-base font-medium"> 已覆盖玩家 </span>
//                                     <span className="text-amber-600 dark:text-amber-400 text-base font-medium font-mono"> {Math.trunc(statsData?.member / 1e4)} </span>
//                                     <span className="text-amber-950 dark:text-amber-200 text-xs font-medium pr-1"> 万名 </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Client */}
//                     <div className={`mx-0.5 flex justify-start gap-2`}>
//                         <div className={`w-0.5 bg-indigo-400 dark:bg-indigo-500`} />
//                         <div className="w-full h-full flex flex-wrap items-baseline justify-start gap-x-2 gap-y-1 z-20">
//                             <span className="text-indigo-950 dark:text-indigo-200 text-base font-medium"> 数据来源 </span>
//                         </div>
//                     </div>
//                     <div className="w-full h-fit sm:w-full rounded flex gap-x-2">
//
//                         {/* From DR */}
//                         <a href={"https://discord.gg/MDvv8Ejntw"} className="w-full sm:w-fit relative flex items-center justify-center p-3"
//                            style={{ width: `${drFights / totalFights * 100}%` }}>
//                             <div className="w-full h-full absolute bg-teal-50 dark:bg-teal-950 rounded-lg border border-teal-300 dark:border-teal-700 blur-[2px] z-10" />
//                             <div className="w-full h-full flex items-center justify-center gap-2 z-20">
//                                 <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline px-2`}>
//                                     <div className="text-teal-950 dark:text-teal-200 text-sm font-medium"> Daily Routines</div>
//                                     <span
//                                             className="text-teal-600 dark:text-teal-400 text-sm font-medium font-mono"> {Math.trunc(drFights / 1e4)} </span>
//                                     <span className="text-teal-950 dark:text-teal-200 text-xs font-medium"> 万条 </span>
//                                 </div>
//                             </div>
//                         </a>
//
//                         {/* From FuckAnimation */}
//                         <a href={"https://discord.gg/MDvv8Ejntw"} className="w-full sm:w-fit relative flex items-center justify-center p-3"
//                            style={{ width: `${fuFights / totalFights * 100}%` }}>
//                             <div className="w-full h-full absolute bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-300 dark:border-yellow-700 blur-[2px] z-10" />
//                             <div className="w-full h-full flex items-center justify-center gap-2 z-20">
//                                 <div className={`hidden lg:flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline px-2`}>
//                                     <div className="text-yellow-950 dark:text-yellow-200 text-sm font-medium"> Fucx Animation</div>
//                                 </div>
//                             </div>
//                         </a>
//
//                         {/*<HoverCard>*/}
//                         {/*    <HoverCardTrigger asChild>*/}
//                         {/*        <div className="w-full sm:w-fit relative flex items-center justify-center p-3"*/}
//                         {/*             style={{ width: `${fuFights / totalFights * 100}%` }}>*/}
//                         {/*            <div*/}
//                         {/*                    className="w-full h-full absolute bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-300 dark:border-yellow-700 blur-[2px] z-10" />*/}
//                         {/*        </div>*/}
//                         {/*    </HoverCardTrigger>*/}
//                         {/*    <HoverCardContent className={`w-auto h-auto p-2`} sideOffset={12}>*/}
//                         {/*        <div className="w-full h-full flex items-center justify-center gap-2 z-20">*/}
//                         {/*            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline px-2`}>*/}
//                         {/*                <div className="text-yellow-950 dark:text-yellow-200 text-sm font-medium"> FuckAnimationLock</div>*/}
//                         {/*                <span*/}
//                         {/*                        className="text-yellow-600 dark:text-yellow-400 text-sm font-medium font-mono"> {Math.trunc(fuFights / 1e4)} </span>*/}
//                         {/*                <span className="text-yellow-950 dark:text-yellow-200 text-xs font-medium"> 万条 </span>*/}
//                         {/*            </div>*/}
//                         {/*        </div>*/}
//                         {/*    </HoverCardContent>*/}
//                         {/*</HoverCard>*/}
//
//                         {/* From FFLogs */}
//                         <a href={`https://fflogs.com`} className="w-full sm:w-fit relative flex items-center justify-center p-3"
//                            style={{ width: `${logsFights / totalFights * 100}%` }}>
//                             <div className="w-full h-full absolute bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-300 dark:border-zinc-500 blur-[2px] z-10" />
//                             <div className="w-full h-full flex items-center justify-center gap-2 z-20">
//                                 <div className={`hidden lg:flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline px-2`}>
//                                     <div className="text-zinc-950 dark:text-zinc-200 text-sm font-medium"> FFLogs</div>
//                                 </div>
//                             </div>
//                         </a>
//                     </div>
//
//                 </div>
//         );
//     }
//
//     return;
// }
