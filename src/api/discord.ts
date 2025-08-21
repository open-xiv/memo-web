import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://discord.com/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

export const getInviteLink = async (id: string): Promise<string> => {
    const res = await apiClient.get(`/guilds/${id}/widget.json`);
    return res.data.instant_invite;
};