import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import StarIcon from "@/assets/icon/star.svg?react";
import ChatIcon from "@/assets/icon/chat.svg?react";
import { useEffect, useState } from "react";
import { getInviteLink } from "@/api/discord.ts";
import HashIcon from "@/assets/icon/hash.svg?react";


export default function Footer() {
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

        void fetchInviteLink();

    }, [inviteLink]);

    return (
            <footer className={`m-2`}>
                <div className={`mx-auto container flex flex-wrap items-center space-3 gap-3`}>

                    {/* Author */}
                    <div className="w-full sm:w-fit relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute rounded-lg border border-border blur-[2px] z-10" />
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <WrapperIcon
                                    icon={StarIcon}
                                    className={`size-6`}
                                    primary="var(--primary)"
                                    secondary="var(--primary-foreground)"
                            />
                            <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center items-baseline`}>
                                <span className="font-medium"> Made by </span>
                                <span className="text-secondary-foreground font-medium"> 蛋卷 </span>
                                <span className="text-xs font-mono font-medium"> HaKu </span>
                                <span className="font-medium"> with </span>
                                <span className="text-primary-foreground font-medium pr-1"> &hearts; </span>
                            </div>
                        </div>
                    </div>

                    {/*  QQ Chat  */}
                    <a href={`https://qun.qq.com/universal-share/share?ac=1&authKey=yVqGsxIgZGR3U0zRdJDc6t7exCAR9UY8C%2B%2BuV%2BekAR0%2FPZk4pMSFp%2FXBcdZVIIHI&busi_data=eyJncm91cENvZGUiOiIxMDU0OTg0Mjk5IiwidG9rZW4iOiJneFJ6NkJ5NGJLRnN6dXFFblBVU2tBbUdwU3dVZS9YaHVjNG5XSGtLUGc4S0RnYUo4ZEo0UDgzYU9qOVA0UU40IiwidWluIjoiMTAwOTg5NTc3NCJ9&data=_E-Wj7y0Z8U8EvSiQAf_xEhF-G0NrWhVsmastd4Rq8iJDmQB8cOdjWCOM-FTGVab6xmu1M5QTA36j4wEQm672w&svctype=4&tempid=h5_group_info`}
                       className="w-full sm:w-fit relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute rounded-lg border border-border blur-[2px] z-10" />
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <WrapperIcon
                                    icon={ChatIcon}
                                    className={`size-6`}
                                    primary="var(--primary)"
                                    secondary="var(--primary-foreground)"
                            />
                            <div className={`flex flex-wrap gap-1`}>
                                <span className="font-medium"> 加入 </span>
                                <span className="text-primary-foreground font-medium"> 群聊 </span>
                            </div>
                        </div>
                    </a>

                    {/*  Discord  */}
                    {inviteLink && <a href={`${inviteLink}`} className="w-full sm:w-fit relative flex items-center justify-center p-3">
                        <div className="w-full h-full absolute rounded-lg border border-border blur-[2px] z-10" />
                        <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                            <WrapperIcon
                                    icon={HashIcon}
                                    className={`size-6`}
                                    primary="var(--secondary-foreground)"
                                    secondary="var(--secondary-foreground)"
                            />
                            <div className={`flex flex-wrap gap-1`}>
                                <span className="font-medium"> 加入 </span>
                                <span className="text-secondary-foreground font-medium"> 频道 </span>
                            </div>
                        </div>
                    </a>}
                </div>
            </footer>
    );
}