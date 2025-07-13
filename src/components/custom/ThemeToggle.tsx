import Icon from "@/components/custom/Icon.tsx";
import Sun from "@/assets/icon/sun.svg?react";
import Moon from "@/assets/icon/moon.svg?react";
import {useTheme} from "@/context/ThemeContext.ts";

export default function ThemeToggle() {
    const {theme, setTheme} = useTheme();

    return (
        <div className="relative flex h-10 w-fit items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 p-2">
            <div className={`w-full h-full absolute bg-zinc-200 dark:bg-zinc-800 rounded-lg border border-zinc-500 dark:border-zinc-700 blur-[2px]`}/>

            <div
                className={`absolute h-7 w-7 rounded-md bg-zinc-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 shadow-md transition-all duration-300 ease-in-out ${theme === "light" ? "left-2" : "left-9"}`}
            />

            <button
                onClick={() => setTheme("light")}
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md transition-colors`}
                aria-label="Light Theme"
            >
                <Icon
                    icon={Sun}
                    className="h-6 w-6"
                    primary={`var(${theme === "light" ? "--color-yellow-100" : "--color-yellow-100"})`}
                    secondary={`var(${theme === "light" ? "--color-yellow-900" : "--color-yellow-300"})`}
                />
            </button>


            <button
                onClick={() => setTheme("dark")}
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-md transition-colors`}
                aria-label="Dark Theme"
            >
                <Icon
                    icon={Moon}
                    className={`h-4 w-4`}
                    primary={`var(${theme === "light" ? "--color-yellow-100" : "--color-yellow-100"})`}
                    secondary={`var(${theme === "light" ? "--color-yellow-900" : "--color-yellow-300"})`}
                />
            </button>
        </div>
    );
}