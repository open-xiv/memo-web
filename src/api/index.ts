import axios from "axios";
import type {Zone} from "@/types/zone.ts";
import type {Fight, MemberZoneProgress} from "@/types/fight.ts";
import {sortPlayersInFight} from "@/lib/job.ts";

const BASE_URL = "https://api.sumemo.dev";

export const getFightByID = async (id: number): Promise<Fight> => {
    const res = await axios.get(`${BASE_URL}/fight/${id}`);
    return sortPlayersInFight(res.data);
};

export const getZoneByID = async (zoneID: number): Promise<Zone> => {
    const res = await axios.get(`${BASE_URL}/zone/${zoneID}`);
    return res.data;
};

// export const getZoneNameByID = async (zoneID: number): Promise<string> => {
//     const res = await axios.get(`${BASE_URL}/zone/${zoneID}/name`);
//     return res.data.name;
// };

export const getMemberZoneProgress = async (name: string, server: string, zoneID: number): Promise<MemberZoneProgress> => {
    const res = await axios.get<MemberZoneProgress>(`${BASE_URL}/member/${name}@${server}/progress/${zoneID}`);
    return res.data;
};