import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import MaxIcon from "@/assets/icon/maximize.svg?react";
import MinIcon from "@/assets/icon/minimize.svg?react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";

interface ToggleExpandProps {
    setExpand: (state: "min" | "max") => void;
}

export default function ToggleExpand({ setExpand }: ToggleExpandProps) {
    const [expand, setLocalState] = useState<"min" | "max">("min");

    const setState = (state: "min" | "max") => {
        setLocalState(state);
        setExpand(state);
    };

    const isMin = expand === "min";

    return (
            <div className="relative flex h-6 w-fit items-center justify-center rounded-lg bg-zone">
                <div className={`w-full h-full absolute rounded-lg bg-zone-border blur-[2px] opacity-30`} />

                <div
                        className={cn(
                                "absolute size-6 rounded-md bg-background border border-zone-border opacity-80 shadow-md transition-all duration-300 ease-in-out",
                                isMin ? "left-0" : "left-7",
                        )}
                />

                <button
                        onClick={() => setState("min")}
                        className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                        aria-label="Minimize"
                >
                    <WrapperIcon
                            icon={MinIcon}
                            className="size-5"
                            primary="var(--zone-foreground)"
                            secondary="var(--zone-foreground)"
                    />
                </button>

                <div className={`w-1`} />

                <button
                        onClick={() => setState("max")}
                        className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                        aria-label="Maximize"
                >
                    <WrapperIcon
                            icon={MaxIcon}
                            className={`size-5`}
                            primary="var(--zone-foreground)"
                            secondary="var(--zone-foreground)"
                    />
                </button>
            </div>
    );
}