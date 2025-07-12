export interface LogsZone {
    encounter: number;
}

export interface Zone {
    zone_id: number;
    name: string;
    code: string;
    description: string;
    logs: LogsZone;
    phases: Phase[];
}

export interface Phase {
    phase_id: number;
    name: string;
    description: string;
    subphases: Subphase[];
}

export interface Subphase {
    subphase_id: number;
    name: string;
    description: string;
    action_id: number[];
}