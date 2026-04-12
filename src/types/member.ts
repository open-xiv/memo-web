import type { Fight, FightProgress } from '@/types/fight.ts';
import type { DutySummary } from '@/types/duty.ts';

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

export interface MemberOverviewZone {
    duty: DutySummary;
    best: MemberZoneProgress | null;
}

export interface MemberOverview {
    name: string;
    server: string;
    zones: Record<string, MemberOverviewZone>;
}
