export interface DutySummary {
    zone_id: number;
    name: string;
    name_en: string | undefined;
    code: string;

    party_size: number;
    level: number;
    logs_encounter: LogsEncounter | undefined;
}

export interface LogsEncounter {
    zone: number;
    encounter: number;
    difficulty: number | undefined;
}

export type Duty = DutySummary;
