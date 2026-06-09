import { cn } from '@/lib/utils.ts';
import WrapperIcon from '@/components/custom/wrapper/WrapperIcon.tsx';
import HeartIcon from '@/assets/icon/heart.svg?react';
import LinkIcon from '@/assets/icon/link.svg?react';

export function BarContribution() {
    return (
        <div className={cn('relative flex items-center justify-start rounded-lg transition-all duration-300 p-3')}>
            <div
                className={cn(
                    'absolute inset-0 rounded-lg border blur-[2px] transition-all duration-300',
                    'bg-accent-pink border-accent-pink-border',
                )}
            />

            <div className="relative z-20 flex h-full items-center justify-start gap-x-2">
                <WrapperIcon
                    icon={HeartIcon}
                    className={cn('size-6 shrink-0 transition-colors duration-300')}
                    primary="var(--accent-purple-strong)"
                    secondary="var(--accent-purple)"
                />
                <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 transition-colors duration-300`}>
                    <span className="text-on-accent-pink font-medium">欢迎贡献</span>
                    <span className="text-accent-pink-strong font-medium">各类高难副本</span>
                    <span className="text-on-accent-pink font-medium">时间轴</span>
                    <a
                        href="https://github.com/open-xiv/assets/tree/main/duty"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-purple-strong font-medium hover:underline flex items-center gap-1 group transition-colors duration-300"
                    >
                        <WrapperIcon
                            icon={LinkIcon}
                            className={`size-4`}
                            primary="var(--accent-pink-strong)"
                            secondary="var(--on-accent-pink)"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
