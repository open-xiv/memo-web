import WrapperIcon from "@/components/custom/wrapper/WrapperIcon.tsx";
import BackwardIcon from "@/assets/icon/backward.svg?react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";

interface ToggleHistoryProps {
    setHistoryMode: (state: true | false) => void;
}

export default function ToggleHistory({ setHistoryMode }: ToggleHistoryProps) {
    const [history, setLocalState] = useState<true | false>(false);

    const setState = (state: true | false) => {
        setLocalState(state);
        setHistoryMode(state);
    };

    const [isHover, setIsHover] = useState(false);
    const isHighlighted = history || isHover;

    return (
            <div
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    className="relative flex h-6 w-fit items-center justify-center rounded-lg bg-zone"
            >
                <div className={`w-full h-full absolute rounded-lg bg-category-border blur-[2px] opacity-30`} />

                <div
                        className={cn(
                                "absolute size-6 rounded-md bg-background border border-category-border shadow-md transition-all duration-300 ease-in-out",
                                isHighlighted
                                        ? "border-category-border bg-category"
                                        : "border-border bg-transparent",
                        )}
                />

                <button
                        onClick={() => setState(!history)}
                        className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                        aria-label="Toggle History Mode"
                >
                    <WrapperIcon
                            icon={BackwardIcon}
                            className={`size-5`}
                            primary={isHighlighted ? "var(--category-ring)" : "var(--muted-foreground)"}
                            secondary={isHighlighted ? "var(--category-foreground)" : "var(--muted-foreground)"}
                    />
                </button>
            </div>
    );
}