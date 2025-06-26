import axios from "axios";
import type {Zone} from "@/types/zone.ts";
import type {Fight, MemberFight} from "@/types/fight.ts";

const BASE_URL = "http://localhost:2025/public";

export const getMemberFights = async (name: string): Promise<MemberFight> => {
    const res = await axios.get(`${BASE_URL}/member/${name}/fights`);
    return res.data;
};

export const getFightByID = async (id: number): Promise<Fight> => {
    const res = await axios.get(`${BASE_URL}/fight/${id}`);
    return res.data;
};

export const getZoneByID = async (zoneID: number): Promise<Zone> => {
    const res = await axios.get(`${BASE_URL}/zone/${zoneID}`);
    return res.data;
};

export const getZoneNameByID = async (zoneID: number): Promise<string> => {
    const res = await axios.get(`${BASE_URL}/zone/${zoneID}/name`);
    return res.data.name;
};