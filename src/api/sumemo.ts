import axios from 'axios';
import type { Duty } from '@/types/duty.ts';
import type { MemberSearchResult, MemberZoneProgress } from '@/types/member.ts';

const BASE_URLS = ['https://api.sumemo.dev', 'https://sumemo.diemoe.net'];
const STORAGE_KEY = 'sumemo_best_node';

const getFastestUrl = (): Promise<string> => {
    return new Promise((resolve) => {
        let resolved = false;

        if (typeof localStorage !== 'undefined') {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached && BASE_URLS.includes(cached)) {
                resolve(cached);
                resolved = true;
            }
        }

        let failedCount = 0;
        BASE_URLS.forEach((url) => {
            axios
                .get(`${url}/status`, { timeout: 5000 })
                .then(() => {
                    if (!resolved) {
                        resolve(url);
                        resolved = true;
                    }
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(STORAGE_KEY, url);
                    }
                })
                .catch(() => {
                    failedCount++;
                    if (failedCount === BASE_URLS.length && !resolved) {
                        resolve(BASE_URLS[0]);
                    }
                });
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

export const getDutyByID = async (zoneID: number): Promise<Duty> => {
    const res = await apiClient.get(`/duty/${zoneID}`);
    return res.data;
};

export const getDutyNameByID = async (zoneID: number): Promise<string> => {
    const res = await apiClient.get(`/duty/${zoneID}/name`);
    return res.data.name;
};

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

export const searchMember = async (query: string): Promise<MemberSearchResult[]> => {
    if (!query) {
        return [];
    }
    const res = await apiClient.get(`/member/search`, { params: { q: query } });
    return res.data;
};
