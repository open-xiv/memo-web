import axios from "axios";
import type { Duty } from "@/types/duty.ts";
import type { MemberSearchResult, MemberZoneProgress } from "@/types/member.ts";
import type { Stats } from "@/types/stats.ts";

const BASE_URLS = ["https://api.sumemo.dev", "https://sumemo.diemoe.net"];

const getFastestUrl = (): Promise<string> => {
    return new Promise((resolve) => {
        let failedCount = 0;
        BASE_URLS.forEach((url) => {
            axios
                .get(url, { timeout: 5000 })
                .then(() => resolve(url))
                .catch(() => {
                    failedCount++;
                    if (failedCount === BASE_URLS.length) {
                        resolve(BASE_URLS[0]);
                    }
                });
        });
    });
};

const baseUrlPromise = getFastestUrl();

const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
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

export const getMemberZoneBestProgress = async (name: string, server: string, zoneID: number): Promise<MemberZoneProgress> => {
    const res = await apiClient.get<MemberZoneProgress>(`/member/${name}@${server}/${zoneID}/best`);
    return res.data;
};

export const getMemberZoneLatestProgresses = async (name: string, server: string, zoneID: number, limit: number = 50): Promise<[MemberZoneProgress]> => {
    const res = await apiClient.get<[MemberZoneProgress]>(`/member/${name}@${server}/${zoneID}/latest`, { params: { limit } });
    return res.data;
};

export const searchMember = async (query: string): Promise<MemberSearchResult[]> => {
    if (!query) {
        return [];
    }
    const res = await apiClient.get(`/member/search`, { params: { q: query } });
    return res.data;
};

export const requestSyncLogs = async (name: string, server: string): Promise<string> => {
    const res = await apiClient.post(`/member/${name}@${server}/sync`);
    return res.data.task_id;
};

export const getTaskStatus = async (taskId: string): Promise<string> => {
    const res = await apiClient.get(`/sync/status/${taskId}`);
    return res.data.status;
};

export const getServerStats = async (): Promise<Stats> => {
    const res = await apiClient.get("/stats");
    return res.data;
};