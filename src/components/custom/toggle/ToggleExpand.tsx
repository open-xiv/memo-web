import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import MaxIcon from '@/assets/icon/maximize.svg?react';
import MinIcon from '@/assets/icon/minimize.svg?react';
import { cn } from '@/lib/utils.ts';

interface ToggleExpandProps {
    expand: 'min' | 'max';
    setExpand: (state: 'min' | 'max') => void;
}

export default function ToggleExpand({ expand, setExpand }: ToggleExpandProps) {
    const isMin = expand === 'min';

    return (
        <div className="relative flex h-6 w-fit items-center justify-center rounded-lg bg-accent-teal">
            <div className={`w-full h-full absolute rounded-lg bg-accent-teal-border blur-[2px] opacity-30`} />

            <div
                className={cn(
                    'absolute size-6 rounded-md bg-surface border border-accent-teal-border opacity-80 shadow-md transition-all duration-300 ease-in-out',
                    isMin ? 'left-0' : 'left-7',
                )}
            />

            <button
                onClick={() => setExpand('min')}
                className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                aria-label="Minimize"
            >
                <WrapperIcon
                    icon={MinIcon}
                    className="size-5"
                    primary="var(--on-accent-teal)"
                    secondary="var(--on-accent-teal)"
                />
            </button>

            <div className={`w-1`} />

            <button
                onClick={() => setExpand('max')}
                className={`relative z-10 flex size-6 items-center justify-center rounded-md transition-colors`}
                aria-label="Maximize"
            >
                <WrapperIcon
                    icon={MaxIcon}
                    className={`size-5`}
                    primary="var(--on-accent-teal)"
                    secondary="var(--on-accent-teal)"
                />
            </button>
        </div>
    );
}
