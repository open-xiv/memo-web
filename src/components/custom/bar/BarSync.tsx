import { cn } from '@/lib/utils.ts';
import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import DownrightIcon from '@/assets/icon/downright.svg?react';

export function BarSync() {
    return (
        <div className={cn('relative flex items-center justify-start rounded-lg transition-all duration-300 p-3')}>
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300',
                    'bg-sync border-sync-border',
                )}
            />

            <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                <WrapperIcon
                    icon={DownrightIcon}
                    className={cn('size-6 shrink-0 transition-colors duration-300')}
                    primary="var(--sync-foreground)"
                    secondary="var(--sync-ring)"
                />
                <span className="text-sync-foreground font-medium transition-colors duration-300">数据同步</span>
            </div>
        </div>
    );
}
