export interface FightStats {
    source: string;
    count: number;
}

export interface Stats {
    fight: [FightStats];
    member: number;
}