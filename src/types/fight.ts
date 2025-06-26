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

export interface Fight {
    id: number;
    zone_id: number;
    timestamp: string;

    players: Player[];

    clear: boolean;
    progress: FightProgress;

    hash: string,
}

export interface MemberFight {
    name: string,
    server: string,
    fights: Fight[];
}