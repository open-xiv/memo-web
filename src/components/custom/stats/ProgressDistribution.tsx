import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { getZoneProgress } from '@/api/sumemo.ts';
import type { ZoneProgress } from '@/types/stats.ts';
import { BarLoading } from '@/components/custom/bar/BarLoading.tsx';

// one accent ramp per phase (strong stop — crisp, readable fills on the ring)
const PHASE_FILLS = [
    'var(--color-accent-teal-strong)',
    'var(--color-accent-pink-strong)',
    'var(--color-accent-amber-strong)',
    'var(--color-accent-purple-strong)',
    'var(--color-accent-indigo-strong)',
];

const RADIAN = Math.PI / 180;

interface Row extends ZoneProgress {
    color: string;
}

function kfmt(v: number): string {
    return v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v);
}

interface DonutLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    percent: number;
    payload: Row;
}

// leader-line label for the larger phases; tiny tail phases (P4/P5) are skipped
// here and listed in the legend below the ring instead.
function renderDonutLabel(p: DonutLabelProps) {
    if (p.percent < 0.05) return null;

    const cos = Math.cos(-p.midAngle * RADIAN);
    const sin = Math.sin(-p.midAngle * RADIAN);
    const side = cos >= 0 ? 1 : -1;

    const sx = p.cx + (p.outerRadius + 2) * cos;
    const sy = p.cy + (p.outerRadius + 2) * sin;
    const mx = p.cx + (p.outerRadius + 16) * cos;
    const my = p.cy + (p.outerRadius + 16) * sin;
    const ex = mx + side * 14;
    const tx = ex + side * 4;
    const anchor = side > 0 ? 'start' : 'end';

    return (
        <g>
            <polyline
                points={`${sx},${sy} ${mx},${my} ${ex},${my}`}
                fill="none"
                stroke={p.payload.color}
                strokeWidth={1.2}
            />
            <text x={tx} y={my - 9} textAnchor={anchor} fontSize={14} fontWeight={500} fill={p.payload.color}>
                {p.payload.phase_name}
            </text>
            <text x={tx} y={my + 9} textAnchor={anchor} fontSize={17} fontWeight={500} fill={p.payload.color}>
                {(p.percent * 100).toFixed(1)}%
            </text>
            <text x={tx} y={my + 25} textAnchor={anchor} fontSize={11} fill="var(--color-on-surface-muted)">
                {kfmt(p.payload.players)}
            </text>
        </g>
    );
}

interface ProgressDistributionProps {
    zoneID: number;
}

export function ProgressDistribution({ zoneID }: ProgressDistributionProps) {
    const [rows, setRows] = useState<ZoneProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        getZoneProgress(zoneID)
            .then((data) => {
                if (active) setRows(data);
            })
            .catch((err) => {
                console.error(`failed to fetch progress distribution for zone ${zoneID}:`, err);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, [zoneID]);

    // wide screens get leader-line labels on the ring; narrow screens would clip
    // them, so they fall back to a full legend under the ring instead.
    const [isWide, setIsWide] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
    );
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const onChange = () => setIsWide(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    const { donut, total, cleared, tail } = useMemo(() => {
        const sorted = [...rows].sort((a, b) => a.phase - b.phase);
        const totalPlayers = sorted.reduce((s, r) => s + r.players, 0);
        const clearedPlayers = sorted.reduce((s, r) => s + r.cleared_players, 0);
        const donutRows: Row[] = sorted.map((r, i) => ({ ...r, color: PHASE_FILLS[i % PHASE_FILLS.length] }));
        const tailRows = donutRows.filter((r) => totalPlayers > 0 && r.players / totalPlayers < 0.05);
        return { donut: donutRows, total: totalPlayers, cleared: clearedPlayers, tail: tailRows };
    }, [rows]);

    if (isLoading) {
        return <BarLoading message="进度分布加载中" />;
    }
    if (!rows.length || total === 0) {
        return null;
    }

    const clearedPct = ((cleared / total) * 100).toFixed(2);

    return (
        <div className="w-full lg:w-[400px] shrink-0 p-4">
            <div className="flex flex-col items-center">
                <div className="relative w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={donut}
                                dataKey="players"
                                nameKey="phase_name"
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="78%"
                                startAngle={90}
                                endAngle={-270}
                                cornerRadius={14}
                                paddingAngle={5}
                                labelLine={false}
                                label={isWide ? (p) => renderDonutLabel(p as unknown as DonutLabelProps) : false}
                                isAnimationActive={false}
                            >
                                {donut.map((d) => (
                                    <Cell key={d.phase} fill={d.color} stroke="none" />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* center summary */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-semibold font-mono text-on-surface-card">
                            {total.toLocaleString()}
                        </span>
                        <span className="text-xs text-on-surface-muted">进度记录</span>
                        <span className="mt-0.5 text-xs font-medium text-status-success-strong">
                            通关 {cleared} · {clearedPct}%
                        </span>
                    </div>
                </div>

                {/* wide: ring has leader labels, only note the thin tail phases.
                    narrow: labels are off, so show a full legend instead. */}
                {(isWide ? tail : donut).length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-tiny text-on-surface-muted">
                        {(isWide ? tail : donut).map((r) => (
                            <span key={r.phase} className="flex items-center gap-1">
                                <span
                                    className="inline-block size-2 rounded-[2px]"
                                    style={{ backgroundColor: r.color }}
                                />
                                {r.phase_name} {((r.players / total) * 100).toFixed(1)}% · {kfmt(r.players)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
