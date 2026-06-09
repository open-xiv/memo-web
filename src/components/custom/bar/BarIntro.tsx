import { cn } from '@/lib/utils.ts';
import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import PolygenIcon from '@/assets/icon/polygen.svg?react';

interface BarIntroProps {
    message: string;
    detail?: string;
}

export function BarIntro({ message, detail }: BarIntroProps) {
    return (
        <div className={cn('relative flex items-center justify-start rounded-lg transition-all duration-300 p-3')}>
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300',
                    'bg-accent-purple border-accent-purple-border',
                )}
            />

            <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                <WrapperIcon
                    icon={PolygenIcon}
                    className={cn('size-6 shrink-0 transition-colors duration-300')}
                    primary="var(--accent-purple-strong)"
                    secondary="var(--accent-purple)"
                />
                <div className={`flex flex-wrap gap-x-2 gap-y-1 transition-colors duration-300`}>
                    <span className="text-on-accent-purple font-medium">{message}</span>
                    {detail && <span className="text-accent-purple-strong font-medium">{detail}</span>}
                </div>
            </div>
        </div>
    );
}
