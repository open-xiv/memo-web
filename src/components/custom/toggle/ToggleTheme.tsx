import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import SunIcon from "@/assets/icon/sun.svg?react";
import MoonIcon from "@/assets/icon/moon.svg?react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToggleTheme() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = resolvedTheme === "dark";

    return (
            <div className="relative flex h-10 w-fit items-center justify-center rounded-lg bg-muted p-2">
                <div className={`w-full h-full absolute rounded-lg border border-border bg-transparent blur-[2px]`} />

                <div
                        className={
                            `absolute size-7 rounded-md bg-background border shadow-md transition-all duration-300 ease-in-out 
                            ${!isDark ? "left-2" : "left-9"}`
                        }
                />

                <button
                        onClick={() => setTheme("light")}
                        className={`relative z-10 flex size-7 items-center justify-center rounded-md transition-colors`}
                        aria-label="Light Theme"
                >
                    <WrapperIcon
                            icon={SunIcon}
                            className="size-6"
                            primary={`var(${!isDark ? "--color-yellow-100" : "--color-yellow-100"})`}
                            secondary={`var(${!isDark ? "--color-yellow-900" : "--color-yellow-300"})`}
                    />
                </button>

                <button
                        onClick={() => setTheme("dark")}
                        className={`relative z-10 flex size-7 items-center justify-center rounded-md transition-colors`}
                        aria-label="Dark Theme"
                >
                    <WrapperIcon
                            icon={MoonIcon}
                            className={`h-4 w-4`}
                            primary={`var(${!isDark ? "--color-yellow-100" : "--color-yellow-100"})`}
                            secondary={`var(${!isDark ? "--color-yellow-900" : "--color-yellow-300"})`}
                    />
                </button>
            </div>
    );
}