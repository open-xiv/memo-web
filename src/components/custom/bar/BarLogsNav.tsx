import { cn } from "@/lib/utils.ts";
import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import ErrorIcon from "@/assets/icon/error.svg?react";
import LinkIcon from "@/assets/icon/link.svg?react";

interface BarLogsNavProps {
    memberName: string;
    memberServer: string;
    zone: number | undefined;
    encounter: number | undefined;
}

export function BarLogsNav({ memberName, memberServer, zone, encounter }: BarLogsNavProps) {

    const link = zone && encounter
            ? `https://fflogs.com/character/cn/${memberServer}/${memberName}?zone=${zone}&boss=${encounter}`
            : undefined;

    return (
            <div className={cn(
                    "flex flex-wrap gap-2 w-full",
            )}>

                {/* info */}
                <div className={cn(
                        "w-full md:w-1/3",
                        "relative flex items-center justify-start rounded-lg transition-all duration-300 p-3",
                )}>

                    <div
                            className={cn(
                                    "absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300",
                                    "bg-destructive border-destructive-border",
                            )}
                    />

                    <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                        <WrapperIcon
                                icon={ErrorIcon}
                                className={cn(
                                        "size-6 shrink-0 transition-colors duration-300",
                                )}
                                primary="var(--destructive-ring)"
                                secondary="var(--destructive-foreground)"
                        />
                        <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300`}>
                            <span className="text-destructive-foreground font-medium"> 未记录 </span>
                            <span className="text-destructive-ring font-medium"> 请通过其他途径判断 </span>
                        </div>
                    </div>

                </div>

                {/*  link  */}
                {link && (
                        <a href={link} className="relative flex items-center justify-center p-3 opacity-80 px-4">
                            <div className="w-full h-full absolute bg-primary rounded-lg border border-primary-border blur-[2px] z-10" />
                            <div className="w-full h-full flex items-center justify-center gap-2 z-20">
                                <WrapperIcon
                                        icon={LinkIcon}
                                        className={`size-6`}
                                        primary="var(--primary-ring)"
                                        secondary="var(--primary-foreground)"
                                />
                                <div className={`flex flex-wrap gap-x-2 gap-y-1 justify-center`}>
                                    <span className="text-primary-foreground font-medium"> 快速跳转 </span>
                                    <span className="text-primary-ring font-medium"> FFLogs </span>
                                </div>
                            </div>
                        </a>
                )}

            </div>
    );
}