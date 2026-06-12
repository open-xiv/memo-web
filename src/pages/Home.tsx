import { BarIntro } from '@/components/custom/bar/BarIntro.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Link } from 'react-router-dom';
import { BarAnalysis } from '@/components/custom/bar/BarAnalysis.tsx';
import { BarSearchGuide } from '@/components/custom/bar/BarSearchGuide.tsx';
import { SyncStatus } from '@/components/custom/sync/SyncStatus.tsx';
import { Kbd } from '@/components/ui/kbd.tsx';
import { lazy, Suspense } from 'react';
import { LatestFights } from '@/components/custom/fight/layout/LatestFights.tsx';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';
import { JobDistribution } from '@/components/custom/stats/JobDistribution.tsx';

const ProgressDistribution = lazy(() =>
    import('@/components/custom/stats/ProgressDistribution.tsx').then((m) => ({
        default: m.ProgressDistribution,
    })),
);

const FEATURED_ZONE_ID = 1363;

export default function Home() {
    return (
        <div className="flex flex-col gap-4">
            <div className={`w-full flex flex-col gap-4`}>
                {/* Intro */}
                <BarIntro message={`欢迎来到`} detail={`酥卷`} />
                <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-surface-card rounded-lg border border-surface-card-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <div className={`ml-2 flex flex-col gap-y-2.5 text-on-surface-card`}>
                            <p>
                                酥卷 <span className={`text-accent-pink-strong text-sm font-mono`}>SuMeMo</span> 是 FFXIV 的{' '}
                                <span className="text-accent-purple-strong">简化</span> 战斗记录平台，提供{' '}
                                <span className="text-accent-purple-strong">当前版本</span> 的高难副本进度查询。
                            </p>
                            <p>
                                本项目完全 <span className={`text-accent-amber-strong`}>用爱发电</span>，旨在解决{' '}
                                <span className="text-accent-purple-strong">进度诈骗</span> 带来的痛苦。
                            </p>
                            <div className={`flex items-center justify-start gap-x-2`}>
                                <Link to={'/help'}>
                                    <Badge variant="outline" className={`text-on-accent-amber`}>
                                        {' '}
                                        常见问题{' '}
                                    </Badge>
                                </Link>
                                <a
                                    href={
                                        'https://discord.com/channels/1387568839285280812/1387793471405821992/1445256557418905750'
                                    }
                                >
                                    <Badge variant="outline" className={`text-on-accent-pink`}>
                                        {' '}
                                        原始统计数据{' '}
                                    </Badge>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress distribution */}
                <BarAnalysis message={`进度分布`} detail={`妖星乱舞绝境战`}></BarAnalysis>
                <div className="mx-4 w-11/12 flex flex-col lg:flex-row gap-4 items-center">
                    <Suspense fallback={<BarLoading message="进度分布加载中" />}>
                        <ProgressDistribution zoneID={FEATURED_ZONE_ID} />
                    </Suspense>
                    <JobDistribution zoneID={FEATURED_ZONE_ID} />
                </div>

                {/* Latest Fights */}
                <BarAnalysis message={`最新战斗`} detail={`妖星乱舞绝境战`}></BarAnalysis>
                <div className="mx-4 w-11/12">
                    <LatestFights zoneID={FEATURED_ZONE_ID} limit={10} />
                </div>

                {/* Sync Status */}
                <SyncStatus />

                {/* Guide */}
                <BarSearchGuide message={`使用指南`} />
                <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                    <div className="w-full h-full absolute bg-surface-card rounded-lg border border-surface-card-border blur-[2px] z-10" />
                    <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                        <div className={`ml-2 flex flex-col gap-y-2.5 text-on-surface-card`}>
                            <p>
                                点击 <span className="text-accent-purple-strong">顶部搜索栏</span>，输入角色名进行查询。
                                <span className={`text-on-surface-muted text-sm`}>「支持模糊搜索」</span>
                            </p>
                            <div className={`flex items-center justify-start gap-x-2`}>
                                使用键盘 <Kbd className={`text-on-accent-amber`}>/</Kbd> 可以快速打开搜索。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
