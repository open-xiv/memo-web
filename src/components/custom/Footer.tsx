import Icon from "@/components/custom/Icon.tsx";
import {useTheme} from "@/context/ThemeContext.ts";
import StarIcon from "@/assets/icon/star.svg?react";
import ChatIcon from "@/assets/icon/chat.svg?react";
import {useEffect, useState} from "react";
import {getInviteLink} from "@/api/discord.ts";
import HashIcon from "@/assets/icon/hash.svg?react";


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
        <div className={`w-full flex flex-wrap gap-2`}>

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

            {/*  QQ Chat  */}
            <a href={`https://qun.qq.com/universal-share/share?ac=1&authKey=yVqGsxIgZGR3U0zRdJDc6t7exCAR9UY8C%2B%2BuV%2BekAR0%2FPZk4pMSFp%2FXBcdZVIIHI&busi_data=eyJncm91cENvZGUiOiIxMDU0OTg0Mjk5IiwidG9rZW4iOiJneFJ6NkJ5NGJLRnN6dXFFblBVU2tBbUdwU3dVZS9YaHVjNG5XSGtLUGc4S0RnYUo4ZEo0UDgzYU9qOVA0UU40IiwidWluIjoiMTAwOTg5NTc3NCJ9&data=_E-Wj7y0Z8U8EvSiQAf_xEhF-G0NrWhVsmastd4Rq8iJDmQB8cOdjWCOM-FTGVab6xmu1M5QTA36j4wEQm672w&svctype=4&tempid=h5_group_info`}
               className="w-full sm:w-fit relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-pink-50 dark:bg-pink-950 rounded-lg border border-pink-300 dark:border-pink-600 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={ChatIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme !== "dark" ? "--color-pink-200" : "--color-pink-900"})`}
                        secondary={`var(${theme !== "dark" ? "--color-pink-900" : "--color-pink-200"})`}
                    />
                    <div className={`flex flex-wrap gap-1`}>
                        <span className="text-pink-950 dark:text-pink-200 text-base font-medium"> 加入 </span>
                        <span className="text-pink-600 dark:text-pink-400 text-base font-medium"> 群聊 </span>
                    </div>
                </div>
            </a>

            {/*  Discord  */}
            {inviteLink && <a href={`${inviteLink}`} className="w-full sm:w-fit relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-purple-50 dark:bg-purple-950/60 rounded-lg border border-purple-300 dark:border-purple-700 blur-[2px] z-10"/>
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <Icon
                        icon={HashIcon}
                        className={`h-6 w-6`}
                        primary={`var(${theme === "light" ? "--color-purple-800" : "--color-purple-300"})`}
                        secondary={`var(${theme === "light" ? "--color-purple-900" : "--color-purple-200"})`}
                    />
                    <div className={`flex flex-wrap gap-1`}>
                        <span className="text-purple-950 dark:text-purple-200 text-base font-medium"> 加入 </span>
                        <span className="text-purple-600 dark:text-purple-400 text-base font-medium"> 频道 </span>
                        {/*<span className="text-purple-950 dark:text-purple-200 text-base font-medium pr-1"> 频道 </span>*/}
                    </div>
                </div>
            </a>}
        </div>
    );
}