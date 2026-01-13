export interface Player {
    name: string;
    server: string;

    job_id: number;
    level: number;

    death_count: number;
}

export interface FightProgress {
    phase: string;
    subphase: string;

    enemy_id: number;
    enemy_hp: number;
}

export interface Fight {
    start_time: string;
    duration: number;

    zone_id: number;
    players: Player[];

    clear: boolean;
    progress: FightProgress;
}