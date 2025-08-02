export interface Player {
    name: string;
    server: string;

    job_id: number;
    level: number;

    death_count: number;
}

export interface FightProgress {
    phase: number;
    subphase: number;

    enemy_id: number;
    enemy_hp: number;
}

export interface LogsFight {
    start_time: number;
    duration: number;
    report_id: string;
    fight_id: number;
}

export interface Fight {
    id: number;

    timestamp: string;

    zone_id: number;
    players: Player[];

    hash: string,
    party_hash: string;

    source: string;

    clear: boolean;
    progress: FightProgress;

    logs: LogsFight;
}