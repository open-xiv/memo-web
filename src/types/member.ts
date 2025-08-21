import type { Fight, FightProgress } from "@/types/fight.ts";

export interface MemberSearchResult {
    name: string;
    server: string;
}

export interface MemberZoneProgress {
    name: string;
    server: string;
    zone_id: number;
    fight_id?: number;
    clear: boolean;
    progress: FightProgress;
    fight?: Fight;
}