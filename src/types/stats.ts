export interface FightStats {
    source: string;
    count: number;
}

export interface Stats {
    fight: [FightStats];
    member: number;
}

export interface ZoneProgress {
    zone_id: number;
    phase: number;
    phase_name: string;

    players: number;
    cleared_players: number;

    hp_best: number;
    hp_p25: number;
    hp_median: number;
    hp_p75: number;

    refreshed_at: string;
}

export interface ZoneJob {
    zone_id: number;
    job_id: number;

    players: number;
    cleared_players: number;

    refreshed_at: string;
}
