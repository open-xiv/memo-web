import axios from 'axios';
import type { SyncProgress } from '@/types/sync.ts';

const SYNCER_BASE = 'https://sync.sumemo.dev';

export const getSyncProgress = async (): Promise<SyncProgress> => {
    const res = await axios.get<SyncProgress>(`${SYNCER_BASE}/progress/`, {
        timeout: 5000,
    });
    return res.data;
};
