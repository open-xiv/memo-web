import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils.ts';

export interface SegmentOption {
    value: string;
    label: string;
}

interface ToggleSegmentProps {
    options: SegmentOption[];
    value: string;
    onChange: (value: string) => void;
}

// A sliding segmented control in the same visual language as ToggleTheme, but
// generalized to N options. The active pill is measured off the live button
// (offsetLeft/offsetWidth) so labels of different widths stay snug.
export default function ToggleSegment({ options, value, onChange }: ToggleSegmentProps) {
    const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [pill, setPill] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
    // gate the slide animation until after the first measurement, so the pill
    // doesn't animate in from {0,0} on mount
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
        const el = btnRefs.current[value];
        if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
        setReady(true);
    }, [value, options]);

    useEffect(() => {
        const onResize = () => {
            const el = btnRefs.current[value];
            if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [value]);

    return (
        <div className="relative flex h-10 w-fit max-w-full items-center gap-1 rounded-lg bg-surface-muted p-1">
            <div className="pointer-events-none absolute inset-0 rounded-lg border border-border-default bg-transparent blur-[2px]" />

            <div
                className={cn(
                    'pointer-events-none absolute top-1 h-8 rounded-md border bg-surface shadow-md',
                    ready && 'transition-all duration-300 ease-in-out',
                )}
                style={{ left: pill.left, width: pill.width }}
            />

            {options.map((option) => {
                const active = option.value === value;
                return (
                    <button
                        key={option.value}
                        ref={(el) => {
                            btnRefs.current[option.value] = el;
                        }}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'relative z-10 flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors duration-300',
                            active ? 'text-on-surface' : 'text-on-surface-muted hover:text-on-surface',
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
