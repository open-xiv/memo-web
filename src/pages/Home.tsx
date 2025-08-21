import Icon from "@/components/custom/Icon.tsx";
import { useTheme } from "@/context/ThemeContext.ts";
import HomeIcon from "@/assets/icon/home.svg?react";
import Footer from "@/components/custom/Footer.tsx";
import { Stats } from "@/components/custom/Stats.tsx";

export default function Home() {
    const { theme } = useTheme();

    return (
        <div className="flex flex-col gap-4">

            <div className={`w-full flex flex-col gap-2`}>

                {/* Welcome */}
                <div className="w-full grow relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-300 dark:border-emerald-700 blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <Icon
                            icon={HomeIcon}
                            className={`h-6 w-6`}
                            primary={`var(${theme === "light" ? "--color-emerald-100" : "--color-emerald-900"})`}
                            secondary={`var(${theme === "light" ? "--color-emerald-950" : "--color-emerald-200"})`}
                        />
                        <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
                            <span className="text-emerald-950 dark:text-emerald-200 text-base font-medium"> 欢迎来到 </span>
                            <span className="text-emerald-600 dark:text-emerald-400 text-base font-medium"> 酥卷 </span>
                            <span className="text-emerald-950 dark:text-emerald-200 text-xs font-mono font-medium"> SuMemo </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>

            {/* Stats */}
            <Stats />
        </div>
    );
}