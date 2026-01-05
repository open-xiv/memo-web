export interface LogsZone {
    zone: number;
    encounter: number;
}

export interface Duty {
    zone_id: number;
    name: string;
    name_en: string | undefined;
    code: string;

    party_size: number;
    level: number;
    logs_encounter: LogsEncounter | undefined;

    timeline: Timeline | undefined;
}

export interface LogsEncounter {
    zone: number;
    encounter: number;
    difficulty: number | undefined;
}

export interface Timeline {
    start_phase: string;
    phases: Phase[];
}

export interface Phase {
    name: string;
    checkpoints: string[];
}