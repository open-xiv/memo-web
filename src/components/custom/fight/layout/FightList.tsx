import type { Fight } from '@/types/fight.ts';
import FightCard from '@/components/custom/fight/list/FightCard.tsx';

interface FightListProps {
    fights: Fight[];
}

export function FightList({ fights }: FightListProps) {
    if (fights.length === 0) {
        return null;
    }

    return (
        <div className="mx-1 w-full flex flex-wrap gap-2">
            {fights.slice(0, 3).map((fight) => (
                <div key={fight.start_time} className="shrink-0">
                    <FightCard fight={fight} />
                </div>
            ))}
        </div>
    );
}
