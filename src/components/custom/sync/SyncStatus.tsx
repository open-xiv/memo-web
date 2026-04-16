import { useEffect, useState } from 'react';
import { getSyncProgress } from '@/api/syncer.ts';
import type { SyncProgress } from '@/types/sync.ts';
import { BarSync } from '@/components/custom/bar/BarSync.tsx';
import { Progress } from '@/components/ui/progress.tsx';
import { getTimeAgo } from '@/lib/time.ts';

export function SyncStatus() {
    const [progress, setProgress] = useState<SyncProgress | null>(null);

    useEffect(() => {
        let active = true;

        const fetch = () => {
            getSyncProgress()
                .then((data) => {
                    if (active) setProgress(data);
                })
                .catch(() => {});
        };

        fetch();
        const id = setInterval(fetch, 5000);
        return () => {
            active = false;
            clearInterval(id);
        };
    }, []);

    if (!progress) return null;

    const { state, total_members, scan, last_scan, next_scan_at } = progress;
    const isScanning = state === 'scanning' || state === 'waiting_for_keys';
    const pct = total_members > 0 ? Math.min((scan.walked / total_members) * 100, 100) : 0;

    return (
        <>
            <BarSync />
            <div className="mx-4 w-11/12 relative flex items-center justify-center p-3">
                <div className="w-full h-full absolute bg-card rounded-lg border border-card-border blur-[2px] z-10" />
                <div className="w-full h-full flex items-center justify-start gap-2 z-20">
                    <div className="ml-2 flex flex-col gap-y-2.5 text-card-foreground w-full">
                        {/* Scanning */}
                        {isScanning && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <Progress
                                        value={pct}
                                        className="h-1.5 bg-sync"
                                        indicatorClassName="bg-sync-ring"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {scan.walked.toLocaleString()} / {total_members.toLocaleString()}
                                        </span>
                                        {scan.at_member && (
                                            <div className="flex items-baseline gap-1 max-w-48 overflow-hidden">
                                                <span className="text-sm font-medium text-card-foreground whitespace-nowrap truncate">
                                                    {scan.at_member.name}
                                                </span>
                                                <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">
                                                    {scan.at_member.server}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p>
                                    本次扫描{' '}
                                    <span className="font-mono font-semibold text-sync-ring">
                                        {scan.counters.members_with_data.toLocaleString()}
                                    </span>{' '}
                                    位玩家
                                    <span className="text-sm text-muted-foreground ml-1">
                                        {scan.counters.fights_uploaded.toLocaleString()} 条新增战斗
                                    </span>
                                    {scan.counters.errors > 0 && (
                                        <span className="text-destructive-ring text-sm ml-1">
                                            {scan.counters.errors} 个错误
                                        </span>
                                    )}
                                </p>
                            </>
                        )}

                        {/* Idle */}
                        {!isScanning && (
                            <>
                                {last_scan ? (
                                    <p>
                                        上次同步{' '}
                                        <span className="font-mono font-semibold text-sync-ring">
                                            {last_scan.counters.members_with_data.toLocaleString()}
                                        </span>{' '}
                                        名玩家
                                        <span className="text-sm text-muted-foreground ml-1">
                                            {last_scan.counters.fights_uploaded.toLocaleString()} 条新增战斗
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground">等待首次扫描</p>
                                )}
                                {next_scan_at && (
                                    <p className="text-sm text-muted-foreground">
                                        下次同步{' '}
                                        <span className="font-semibold">{getTimeAgo(next_scan_at)}</span>
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
