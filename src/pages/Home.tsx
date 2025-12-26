import { BarIntro } from "@/components/custom/bar/BarIntro.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Link } from "react-router-dom";
import { BarAnalysis } from "@/components/custom/bar/BarAnalysis.tsx";
import AttendanceImage from "@/assets/analysis/attendance.png";
import ClearImage from "@/assets/analysis/clear.png";
import RateImage from "@/assets/analysis/rate.png";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BarSearchGuide } from "@/components/custom/bar/BarSearchGuide.tsx";
import { Kbd } from "@/components/ui/kbd.tsx";

export default function Home() {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
            <div className="flex flex-col gap-4">

                <div className={`w-full flex flex-col gap-4`}>

                    {/* Intro */}
                    <BarIntro message={`欢迎来到`} detail={`酥卷`} />
                    <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                                <p>
                                    酥卷 <span className={`text-primary-ring text-sm font-mono`}>SuMeMo</span> 是 FFXIV 的 <span
                                        className="text-category-ring">简化</span> 战斗记录平台，提供 <span className="text-category-ring">当前版本</span> 的高难副本进度查询。
                                </p>
                                <p>
                                    本项目完全 <span className={`text-secondary-ring`}>用爱发电</span>，旨在解决 <span
                                        className="text-category-ring">进度诈骗</span> 带来的痛苦。
                                </p>
                                <div className={`flex items-center justify-start gap-x-2`}>
                                    <Link to={"/help"}>
                                        <Badge variant="outline" className={`text-secondary-foreground`}> 常见问题 </Badge>
                                    </Link>
                                    <a href={"https://discord.com/channels/1387568839285280812/1387793471405821992/1445256557418905750"}>
                                        <Badge variant="outline" className={`text-primary-foreground`}> 原始统计数据 </Badge>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis */}
                    <BarAnalysis message={`数据披露`} detail={`中量级`}></BarAnalysis>
                    <ScrollArea className="mx-4 w-11/12 relative flex items-center justify-center whitespace-nowrap">
                        {/*<div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />*/}
                        <div className="w-max h-full flex items-center justify-start gap-4 z-20 mb-2">

                            {/* Attendance */}
                            <figure key="attendance-analysis">
                                <img src={AttendanceImage} alt="Attendance Analysis" className={cn(
                                        "h-52 rounded-md transition-colors duration-300",
                                        isDark && "invert",
                                )} />
                                <figcaption className={`text-card-foreground mt-2 mx-2 flex items-baseline justify-start font-medium`}>
                                    <span className={`font-semibold mr-1`}> 1. </span>
                                    中量级参加人数
                                    <span className={`text-primary-foreground text-sm font-semibold ml-2`}> 至少进入一次副本 </span>
                                </figcaption>
                            </figure>

                            {/* Clear */}
                            <figure key="clear-analysis">
                                <img src={ClearImage} alt="Clear Rate Analysis" className={cn(
                                        "h-52 rounded-md transition-colors duration-300",
                                        isDark && "invert",
                                )} />
                                <figcaption className={`text-card-foreground mt-2 mx-2 flex items-baseline justify-start font-medium`}>
                                    <span className={`font-semibold mr-1`}> 2. </span>
                                    中量级通关人数
                                    <span className={`text-primary-foreground text-sm font-semibold ml-2`}> 完成 </span>
                                    <span className={`text-primary-foreground text-sm font-mono font-semibold ml-2`}> m8s </span>
                                </figcaption>
                            </figure>

                            {/* Pass Rate */}
                            <figure key="rate-analysis">
                                <img src={RateImage} alt="Pass Rate Analysis" className={cn(
                                        "h-52 rounded-md transition-colors duration-300",
                                        isDark && "invert",
                                )} />
                                <figcaption className={`text-card-foreground mt-2 mx-2 flex items-baseline justify-start font-medium`}>
                                    <span className={`font-semibold mr-1`}> 3. </span>
                                    中量级通关率
                                    <span className={`text-primary-foreground text-sm font-semibold ml-2`}> 各层的通过率 </span>
                                </figcaption>
                            </figure>
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                                <p>
                                    数据 <span className={`text-primary-foreground`}>仅供参考</span>，用于分析副本难度。
                                </p>
                                <p>
                                    统计数据源于玩家上报频率，存在少许误差。
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Guide */}
                    <BarSearchGuide message={`使用指南`} />
                    <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <div className={`ml-2 flex flex-col gap-y-2.5 text-card-foreground`}>
                                <p>
                                    点击 <span className="text-category-ring">顶部搜索栏</span>，输入角色名进行查询。<span
                                        className={`text-muted-foreground text-sm`}>「支持模糊搜索」</span>
                                </p>
                                <div className={`flex items-center justify-start gap-x-2`}>
                                    使用键盘 <Kbd className={`text-secondary-foreground`}>/</Kbd> 可以快速打开搜索。
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    );
}