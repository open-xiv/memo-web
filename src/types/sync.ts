export interface SyncCounters {
    filtered_non_cn: number;
    filtered_recent: number;
    queued: number;
    no_fflogs_char: number;
    members_with_data: number;
    fights_uploaded: number;
    errors: number;
}

export interface SyncMemberRef {
    id: number;
    name: string;
    server: string;
}

export interface SyncCurrentScan {
    started_at?: string;
    walked: number;
    expected_queued: number;
    at_member?: SyncMemberRef;
    counters: SyncCounters;
}

export interface SyncLastScan {
    started_at: string;
    finished_at: string;
    duration_ms: number;
    walked: number;
    expected_queued: number;
    counters: SyncCounters;
}

export interface SyncWorkers {
    count: number;
    waiting: number;
}

export interface SyncKeys {
    total: number;
    active: number;
    disabled: number;
    total_limit: number;
    total_remaining: number;
    earliest_reset?: string;
}

export interface SyncProgress {
    state: 'idle' | 'scanning' | 'waiting_for_keys';
    total_members: number;
    scan: SyncCurrentScan;
    last_scan?: SyncLastScan;
    next_scan_at?: string;
    keys_recover_at?: string;
    workers: SyncWorkers;
    keys?: SyncKeys;
}
