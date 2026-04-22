import { useEffect, useState } from 'react';
import type { MemberOverview } from '@/types/member.ts';
import type { DutySummary } from '@/types/duty.ts';
import FightCard from '@/components/custom/fight/list/FightCard.tsx';
import { cn } from '@/lib/utils.ts';
import { getJobIconByID } from '@/lib/job.ts';

interface FightOverviewProps {
    overview: MemberOverview;
    interest: number[];
    selectedZone: number | null;
    onSelectZone: (zoneID: number) => void;
}

const GLITCH_CHARS = '0123456789ABCDEF:.-';

function ScrambleText({ length, className }: { length: number; className?: string }) {
    const [text, setText] = useState(() =>
        Array.from({ length }, () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]).join(''),
    );

    useEffect(() => {
        const id = setInterval(() => {
            setText(
                Array.from({ length }, () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]).join(''),
            );
        }, 120);
        return () => clearInterval(id);
    }, [length]);

    return <span className={cn('font-mono', className)}>{text}</span>;
}

// Standard 8-man comp: 2T 2H 4D
const TANK_IDS = [19, 21, 32, 37]; // PLD WAR DRK GNB
const HEALER_IDS = [24, 28, 33, 40]; // WHM SCH AST SGE
const DPS_IDS = [20, 22, 23, 25, 27, 30, 31, 34, 35, 38, 39, 41, 42]; // MNK DRG BRD BLM SMN NIN MCH SAM RDM DNC RPR VPR PCT

function pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function rollParty() {
    const ids = [
        ...pickRandom(TANK_IDS, 2),
        ...pickRandom(HEALER_IDS, 2),
        ...pickRandom(DPS_IDS, 4),
    ];
    // shuffle so local (first) icon isn't always a tank
    ids.sort(() => Math.random() - 0.5);
    return ids.map((id) => getJobIconByID(id)).filter(Boolean) as string[];
}

const ALL_COMBAT_IDS = [...TANK_IDS, ...HEALER_IDS, ...DPS_IDS];

function useRandomParty() {
    const [icons, setIcons] = useState(rollParty);

    useEffect(() => {
        const id = setInterval(() => {
            setIcons((prev) => {
                const next = [...prev];
                // swap 1 random slot each tick
                const slot = Math.floor(Math.random() * next.length);
                const randomId = ALL_COMBAT_IDS[Math.floor(Math.random() * ALL_COMBAT_IDS.length)];
                const icon = getJobIconByID(randomId);
                if (icon) next[slot] = icon;
                return next;
            });
        }, 200);
        return () => clearInterval(id);
    }, []);

    return icons;
}

function EmptyFightCard({ duty, selected }: { duty?: DutySummary; selected?: boolean }) {
    const icons = useRandomParty();

    return (
        <div className="group min-w-80 relative flex flex-col items-center p-4 gap-2">
            <div
                className={cn(
                    'w-full h-full absolute inset-0 rounded-lg border blur-[2px] z-10 transition-all duration-300',
                    selected
                        ? 'bg-primary/30 border-primary-border'
                        : 'bg-card border-card-border group-hover:border-secondary-border group-hover:bg-secondary/30',
                )}
            />

            {/* Top row — mirrors FightCard: icon + zone/hash | time block */}
            <div className="w-full flex items-start justify-between z-20">
                <div className="flex items-center justify-center gap-2.5">
                    <img src={icons[0]} alt="job" className="w-9 h-9 opacity-30 grayscale" />
                    <div className="flex flex-col items-start justify-center gap-0.5">
                        <div className="flex gap-0.5 items-center">
                            <span className="text-card-foreground text-sm font-medium">
                                {duty?.name ?? '未知副本'}
                            </span>
                        </div>
                        <span className="text-destructive-ring text-xs font-normal">未记录</span>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-start gap-0.5">
                    <ScrambleText length={5} className="text-card-ring/40 text-sm font-medium" />
                    <div className="flex flex-col items-end gap-0 text-tiny">
                        <ScrambleText length={7} className="text-card-ring/25" />
                        <div className="flex items-center gap-1 opacity-80">
                            <ScrambleText length={4} className="text-card-ring/25" />
                            <span className="text-card-ring/25">·</span>
                            <ScrambleText length={5} className="text-card-ring/25" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom row — mirrors FightCard: party icons | progress */}
            <div className="w-full flex items-end justify-between z-20">
                <div className="flex items-center justify-start gap-1">
                    {icons.slice(1).map((icon, i) => (
                        <img
                            key={i}
                            src={icon}
                            alt="job"
                            className="w-6 h-6 opacity-20 grayscale"
                        />
                    ))}
                </div>
                <div className="flex gap-x-0.5 items-baseline">
                    <ScrambleText length={4} className="text-card-ring/30 text-[10px]" />
                    <ScrambleText length={4} className="text-card-ring/30 text-sm font-semibold" />
                    <ScrambleText length={1} className="text-card-ring/30 text-xs" />
                </div>
            </div>
        </div>
    );
}

export function FightOverview({ overview, interest, selectedZone, onSelectZone }: FightOverviewProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {interest.map((zoneID) => {
                const zoneData = overview.zones[String(zoneID)];
                const bestFight = zoneData?.best?.fight;
                const duty = zoneData?.duty;
                const isSelected = selectedZone === zoneID;

                return (
                    <div
                        key={zoneID}
                        className="cursor-pointer shrink-0"
                        onClick={() => onSelectZone(zoneID)}
                    >
                        {bestFight ? (
                            <FightCard fight={bestFight} duty={duty} selected={isSelected} />
                        ) : (
                            <EmptyFightCard duty={duty} selected={isSelected} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
