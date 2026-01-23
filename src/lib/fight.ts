import type { Fight, Player } from '@/types/fight.ts';
import { sortPlayersInFight } from '@/lib/job.ts';

export interface FightGroup {
    key: string;

    players: Player[];
    fights: Fight[];

    totalDeaths: Record<string, number>;

    isClear: boolean;
    phase: string;
    enemyHp: number;
    enemyId?: number;

    startTime: string;
    duration: number;
}

export function groupFightsByTeam(fights: Fight[]): FightGroup[] {
    const groups: FightGroup[] = [];
    const keyToGroupIndex = new Map<string, number>();

    fights.forEach((fight) => {
        const sortedFight = sortPlayersInFight(fight);
        const key = sortedFight.players.map((p) => `${p.name}@${p.server}`).join('|');
        const fightEndTime = new Date(fight.start_time).getTime() + fight.duration / 1e6;

        let groupIndex = keyToGroupIndex.get(key);

        if (groupIndex !== undefined) {
            const group = groups[groupIndex];
            const lastFight = group.fights[group.fights.length - 1];
            const lastFightStartTime = new Date(lastFight.start_time).getTime();

            // interval > 4 hours -> split into new group
            if (lastFightStartTime - fightEndTime > 4 * 60 * 60 * 1000) {
                groupIndex = undefined;
            }
        }

        if (groupIndex === undefined) {
            groups.push({
                key: key,
                players: sortedFight.players,
                fights: [],
                totalDeaths: {},
                isClear: fight.clear,
                phase: fight.progress.phase && fight.progress.phase !== 'N/A' ? fight.progress.phase : '',
                enemyHp: fight.progress.enemy_hp,
                startTime: fight.start_time,
                duration: fight.duration,
            });
            groupIndex = groups.length - 1;
            keyToGroupIndex.set(key, groupIndex);

            sortedFight.players.forEach((p) => {
                groups[groupIndex!].totalDeaths[`${p.name}@${p.server}`] = 0;
            });
        }

        const group = groups[groupIndex];
        group.fights.push(fight);

        // update the earliest start time and calculate total duration
        const groupStartTimeMs = new Date(group.startTime).getTime();
        const fightStartTimeMs = new Date(fight.start_time).getTime();
        const groupEndTimeMs = groupStartTimeMs + group.duration / 1e6;

        if (fightStartTimeMs < groupStartTimeMs) {
            // new earliest start time - recalculate duration
            const newDuration = (groupEndTimeMs - fightStartTimeMs) * 1e6;
            group.startTime = fight.start_time;
            group.duration = newDuration;
        }
        if (fightEndTime > groupEndTimeMs) {
            // new latest end time - update duration
            group.duration = (fightEndTime - new Date(group.startTime).getTime()) * 1e6;
        }

        // update best progress: find fight with max enemy_id
        const clearedFight = group.fights.find(f => f.clear);
        if (clearedFight) {
            group.isClear = true;
            group.enemyHp = 0;
            group.enemyId = clearedFight.progress.enemy_id;
            group.phase = clearedFight.progress.phase && clearedFight.progress.phase !== 'N/A' ? clearedFight.progress.phase : '';
        } else {
            const maxEnemyId = Math.max(...group.fights.map(f => f.progress.enemy_id));
            const fightsWithMaxEnemy = group.fights.filter(f => f.progress.enemy_id === maxEnemyId);
            const bestFight = fightsWithMaxEnemy.reduce((best, f) => f.progress.enemy_hp < best.progress.enemy_hp ? f : best);
            group.enemyId = bestFight.progress.enemy_id;
            group.enemyHp = bestFight.progress.enemy_hp;
            group.phase = bestFight.progress.phase && bestFight.progress.phase !== 'N/A' ? bestFight.progress.phase : '';
        }

        fight.players.forEach((p) => {
            const pKey = `${p.name}@${p.server}`;
            if (group.totalDeaths[pKey] !== undefined) {
                group.totalDeaths[pKey] += p.death_count;
            }
        });
    });

    return groups;
}
