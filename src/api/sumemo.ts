import axios from 'axios';
import type { MemberOverview, MemberSearchResult, MemberZoneProgress } from '@/types/member.ts';
import type { Fight } from '@/types/fight.ts';

const BASE_URLS = ['https://api.sumemo.dev', 'https://sumemo.diemoe.net'];
const STORAGE_KEY = 'sumemo_best_node';

const getFastestUrl = (): Promise<string> => {
    return new Promise((resolve) => {
        let resolved = false;

        // use cached node immediately if available
        if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached && BASE_URLS.includes(cached)) {
                resolve(cached);
                resolved = true;
            }
        }

        // no cache: resolve with default immediately, update in background
        if (!resolved) {
            resolve(BASE_URLS[0]);
        }

        // always race in background to find and cache the fastest node
        let raceResolved = false;
        BASE_URLS.forEach((url) => {
            axios
                .get(`${url}/status`, { timeout: 5000 })
                .then(() => {
                    if (!raceResolved && typeof localStorage !== 'undefined') {
                        raceResolved = true;
                        localStorage.setItem(STORAGE_KEY, url);
                    }
                })
                .catch(() => {});
        });
    });
};

const baseUrlPromise = getFastestUrl();

const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    config.baseURL = await baseUrlPromise;
    return config;
});

export const getMemberHiddenStatus = async (name: string, server: string): Promise<boolean> => {
    const res = await apiClient.get(`/member/${name}@${server}/hidden`);
    return res.data.hidden;
};

export const getMemberZoneBestProgress = async (
    name: string,
    server: string,
    zoneID: number,
): Promise<MemberZoneProgress> => {
    const res = await apiClient.get<MemberZoneProgress>(`/member/${name}@${server}/${zoneID}/best`);

    const data = res.data;
    if (!data.clear && data.fight) {
        data.fight.players = data.fight.players.map((p) => ({
            ...p,
            death_count: Math.max(0, p.death_count - 1),
        }));
    }

    return data;
};

export const getMemberZoneLatestProgresses = async (
    name: string,
    server: string,
    zoneID: number,
    limit: number = 50,
): Promise<[MemberZoneProgress]> => {
    const res = await apiClient.get<[MemberZoneProgress]>(`/member/${name}@${server}/${zoneID}/latest`, {
        params: { limit },
    });
    const data = res.data;

    return data.map((progress) => {
        if (!progress.clear && progress.fight?.players) {
            return {
                ...progress,
                fight: {
                    ...progress.fight,
                    players: progress.fight.players.map((player) => ({
                        ...player,
                        death_count: Math.max(0, player.death_count - 1),
                    })),
                },
            };
        }
        return progress;
    }) as [MemberZoneProgress];
};

// normalize death counts the same way member endpoints do: the wiping pull
// registers a death for everyone, so drop one off non-clear fights.
const normalizeFightDeaths = (fight: Fight): Fight => {
    if (fight.clear || !fight.players) {
        return fight;
    }
    return {
        ...fight,
        players: fight.players.map((p) => ({ ...p, death_count: Math.max(0, p.death_count - 1) })),
    };
};

export const getZoneLeaderboard = async (zoneID: number, limit: number = 100): Promise<Fight[]> => {
    const res = await apiClient.get<Fight[]>(`/fight/leaderboard/${zoneID}`, { params: { limit } });
    return res.data.map(normalizeFightDeaths);
};

export const getZoneRecentFights = async (zoneID: number, limit: number = 50): Promise<Fight[]> => {
    const res = await apiClient.get<Fight[]>(`/fight/recent/${zoneID}`, { params: { limit } });
    return res.data.map(normalizeFightDeaths);
};

export const getMemberOverview = async (name: string, server: string): Promise<MemberOverview> => {
    const res = await apiClient.get<MemberOverview>(`/member/${name}@${server}/overview`);
    const data = res.data;

    // normalize death counts for non-clear best fights (same as existing endpoints)
    for (const zone of Object.values(data.zones)) {
        if (zone.best && !zone.best.clear && zone.best.fight?.players) {
            zone.best.fight.players = zone.best.fight.players.map((p) => ({
                ...p,
                death_count: Math.max(0, p.death_count - 1),
            }));
        }
    }

    return data;
};

export const searchMember = async (query: string): Promise<MemberSearchResult[]> => {
    if (!query) {
        return [];
    }
    const res = await apiClient.get(`/member/search`, { params: { q: query } });
    return res.data;
};
