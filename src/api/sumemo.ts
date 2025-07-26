import axios from "axios";
import type {Zone} from "@/types/zone.ts";
import type {Fight, MemberZoneProgress} from "@/types/fight.ts";
import {sortPlayersInFight} from "@/lib/job.ts";

const apiClient = axios.create({
    baseURL: "https://api.sumemo.dev",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});

export const getFightByID = async (id: number): Promise<Fight> => {
    const res = await apiClient.get(`/fight/${id}`);
    return sortPlayersInFight(res.data);
};

export const getZoneByID = async (zoneID: number): Promise<Zone> => {
    const res = await apiClient.get(`/zone/${zoneID}`);
    return res.data;
};

export const getZoneNameByID = async (zoneID: number): Promise<string> => {
    const res = await apiClient.get(`/zone/${zoneID}/name`);
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

export const getMemberZoneLatestProgresses = async (name: string, server: string, zoneID: number): Promise<[MemberZoneProgress]> => {
    const res = await apiClient.get<[MemberZoneProgress]>(`/member/${name}@${server}/${zoneID}/latest?limit=20`);
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

export const getServerStatus = async (): Promise<boolean> => {
    try {
        await apiClient.get("/status");
        return true;
    } catch {
        return false;
    }
};
