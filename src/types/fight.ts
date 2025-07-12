export interface Player {
    id: number;
    name: string;
    server: string;
    job_id: number;
    level: number;
}

export interface FightProgress {
    phase: number;
    subphase: number;
}

export interface LogsFight {
    start_time: number;
    duration: number;
    report_id: string;
    fight_id: number;
}

export interface Fight {
    id: number;
    zone_id: number;
    timestamp: string;

    players: Player[];

    clear: boolean;
    progress: FightProgress;

    hash: string,

    logs: LogsFight;
    is_logs_only: boolean;
}

export interface MemberFight {
    name: string,
    server: string,
    fights: Fight[];
}

export interface MemberZoneProgress {
    name: string;
    server: string;
    zone_id: number;
    fight_id?: number;
    clear: boolean;
    progress: FightProgress;
}