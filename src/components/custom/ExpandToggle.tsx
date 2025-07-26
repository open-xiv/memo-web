import Icon from "@/components/custom/Icon.tsx";
import MaxIcon from "@/assets/icon/maximize.svg?react";
import MinIcon from "@/assets/icon/minimize.svg?react";
import {useTheme} from "@/context/ThemeContext.ts";
import {useState} from "react";

interface ExpandToggleProps {
    setExpand: (state: "min" | "max") => void;
}

export default function ExpandToggle({setExpand}: ExpandToggleProps) {
    const {theme} = useTheme();

    const [expand, setLocalState] = useState<"min" | "max">("min");
    const setState = (state: "min" | "max") => {
        setLocalState(state);
        setExpand(state);
    };

    return (
        <div className="relative flex h-6 w-fit items-center justify-center rounded-md bg-teal-100 dark:bg-teal-900 z-20">
            {/*<div className={`w-full h-full absolute bg-teal-100 dark:bg-teal-800 rounded-lg border border-teal-500 dark:border-teal-700 blur-[2px]`}/>*/}

            <div
                className={`absolute size-6 rounded-md bg-teal-50 dark:bg-teal-700 border border-teal-300 dark:border-teal-600 shadow-md transition-all duration-300 ease-in-out ${expand === "min" ? "left-0" : "left-7"}`}
            />

            <button
                onClick={() => setState("min")}
                className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                aria-label="Minimize"
            >
                <Icon
                    icon={MinIcon}
                    className="size-5"
                    primary={`var(${theme === "light" ? "--color-teal-950" : "--color-teal-200"})`}
                    secondary={`var(${theme === "light" ? "--color-teal-950" : "--color-teal-200"})`}
                />
            </button>

            <div className={`w-1`}/>

            <button
                onClick={() => setState("max")}
                className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                aria-label="Maximize"
            >
                <Icon
                    icon={MaxIcon}
                    className={`size-5`}
                    primary={`var(${theme === "light" ? "--color-teal-950" : "--color-teal-200"})`}
                    secondary={`var(${theme === "light" ? "--color-teal-950" : "--color-teal-200"})`}
                />
            </button>
        </div>
    );
}