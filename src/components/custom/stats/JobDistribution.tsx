import { useEffect, useMemo, useState } from 'react';
import { getZoneJobs } from '@/api/sumemo.ts';
import type { ZoneJob } from '@/types/stats.ts';
import { getJobByID, getJobIconByID, type JobRole } from '@/lib/job.ts';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';

// grouped by role (tank → healer → dps), tinted with each role's strong stop
// rendered at 50%; the bar colour is what distinguishes the roles now.
const ROLES: { key: JobRole; color: string }[] = [
    { key: 'Tank', color: 'var(--color-role-tank-strong)' },
    { key: 'Healer', color: 'var(--color-role-healer-strong)' },
    { key: 'DPS', color: 'var(--color-role-dps-strong)' },
];

interface JobRow {
    job_id: number;
    players: number;
    icon: string | null;
}

interface RoleGroup {
    key: JobRole;
    color: string;
    jobs: JobRow[];
}

interface JobDistributionProps {
    zoneID: number;
}

export function JobDistribution({ zoneID }: JobDistributionProps) {
    const [rows, setRows] = useState<ZoneJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        getZoneJobs(zoneID)
            .then((data) => {
                if (active) setRows(data);
            })
            .catch((err) => {
                console.error(`failed to fetch job distribution for zone ${zoneID}:`, err);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, [zoneID]);

    const { groups, max } = useMemo(() => {
        const maxPlayers = rows.reduce((m, r) => Math.max(m, r.players), 0);
        const roleGroups: RoleGroup[] = ROLES.map((role) => ({
            ...role,
            jobs: rows
                .filter((r) => getJobByID(r.job_id)?.role === role.key)
                .sort((a, b) => b.players - a.players)
                .map((r) => ({ job_id: r.job_id, players: r.players, icon: getJobIconByID(r.job_id) })),
        })).filter((g) => g.jobs.length > 0);
        return { groups: roleGroups, max: maxPlayers };
    }, [rows]);

    if (isLoading) {
        return <BarLoading message="职业分布加载中" />;
    }
    if (!groups.length) {
        return null;
    }

    return (
        <div className="relative w-full lg:flex-1 lg:min-w-0 p-4">
            <div className="absolute inset-0 rounded-lg border border-surface-card-border bg-surface-card blur-[2px] z-10" />
            <div className="relative z-20 flex flex-col gap-3">
                <div className="flex items-baseline justify-between px-1">
                    <span className="text-xs text-on-surface-muted">职业分布</span>
                    <span className="text-tiny text-on-surface-muted">按主职业 · 每人计一次</span>
                </div>

                {groups.map((g) => (
                    <div key={g.key} className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5">
                        {g.jobs.map((j) => (
                            <div key={j.job_id} className="flex items-center gap-1.5">
                                {j.icon && <img src={j.icon} alt="" className="size-5 shrink-0" />}
                                <div className="relative flex-1 h-2 rounded-full bg-surface-muted overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full opacity-50"
                                        style={{
                                            width: `${max > 0 ? (j.players / max) * 100 : 0}%`,
                                            backgroundColor: g.color,
                                        }}
                                    />
                                </div>
                                <span className="w-9 shrink-0 text-right text-tiny font-mono text-on-surface-muted">
                                    {j.players.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
