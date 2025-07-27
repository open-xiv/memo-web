import Icon from "@/components/custom/Icon.tsx";
import {useTheme} from "@/context/ThemeContext.ts";
import StarIcon from "@/assets/icon/star.svg?react";
import ChatIcon from "@/assets/icon/chat.svg?react";
import {useEffect, useState} from "react";
import {getInviteLink} from "@/api/discord.ts";


export default function Footer() {
    const {theme} = useTheme();

    const [inviteLink, setInviteLink] = useState<string>("");

    useEffect(() => {
        const fetchInviteLink = async () => {
            try {
                const inviteLink = await getInviteLink("1387568839285280812");
                setInviteLink(inviteLink);
            } catch {
                console.error("获取 Discord 邀请链接失败");
            }
        };

        fetchInviteLink();

    }, [inviteLink]);

    return (
        <div className={`w-full flex gap-2 flex-wrap`}>

            {/* Author */}
            <div className="w-full sm:w-fit relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-300 dark:border-blue-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={StarIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-blue-100" : "--color-blue-800"})`}
                        secondary={`var(${theme === "light" ? "--color-blue-900" : "--color-blue-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
                        <span className="text-blue-950 dark:text-blue-200 text-base font-medium"> Made by </span>
                        <span className="text-blue-600 dark:text-blue-400 text-base font-medium"> 蛋卷 </span>
                        <span className="text-blue-950 dark:text-blue-200 text-xs font-mono font-medium"> HaKu </span>
                        <span className="text-blue-950 dark:text-blue-200 text-base font-medium"> with </span>
                        <span className="text-pink-400 dark:text-pink-200 text-base font-medium pr-1"> &hearts; </span>
                    </div>
                </div>
            </div>

            {/*  Discord  */}
            {inviteLink && <a href={`${inviteLink}`} className="w-full sm:w-fit relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-purple-50 dark:bg-purple-950/60 rounded-lg border border-purple-300 dark:border-purple-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={ChatIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-purple-200" : "--color-purple-400"})`}
                        secondary={`var(${theme === "light" ? "--color-purple-950" : "--color-purple-200"})`}
                    />
                    <div className={`flex flex-wrap gap-x-2 gap-y-1`}>
                        <span className="text-purple-950 dark:text-purple-200 text-base font-medium"> 加入 </span>
                        <span className="text-purple-600 dark:text-purple-400 text-base font-medium"> Discord </span>
                        <span className="text-purple-950 dark:text-purple-200 text-base font-medium pr-1"> 讨论 </span>
                    </div>
                </div>
            </a>}
        </div>
    );
}