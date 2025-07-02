import type {Fight} from "@/types/fight.ts";

interface Job {
    name: string;
    role: JobRole;
    iconUrl: string | null;
}

type JobRole = "Tank" | "Healer" | "DPS" | "Crafter" | "Gatherer" | "Limited";

const jobDefinitions: Record<number, Omit<Job, "iconUrl">> = {
    1: {name: "gladiator", role: "Tank"},
    2: {name: "pugilist", role: "DPS"},
    3: {name: "marauder", role: "Tank"},
    4: {name: "lancer", role: "DPS"},
    5: {name: "archer", role: "DPS"},
    6: {name: "conjurer", role: "Healer"},
    7: {name: "thaumaturge", role: "DPS"},
    8: {name: "carpenter", role: "Crafter"},
    9: {name: "blacksmith", role: "Crafter"},
    10: {name: "armorer", role: "Crafter"},
    11: {name: "goldsmith", role: "Crafter"},
    12: {name: "leatherworker", role: "Crafter"},
    13: {name: "weaver", role: "Crafter"},
    14: {name: "alchemist", role: "Crafter"},
    15: {name: "culinarian", role: "Crafter"},
    16: {name: "miner", role: "Gatherer"},
    17: {name: "botanist", role: "Gatherer"},
    18: {name: "fisher", role: "Gatherer"},
    19: {name: "paladin", role: "Tank"},
    20: {name: "monk", role: "DPS"},
    21: {name: "warrior", role: "Tank"},
    22: {name: "dragoon", role: "DPS"},
    23: {name: "bard", role: "DPS"},
    24: {name: "whitemage", role: "Healer"},
    25: {name: "blackmage", role: "DPS"},
    26: {name: "arcanist", role: "DPS"},
    27: {name: "summoner", role: "DPS"},
    28: {name: "scholar", role: "Healer"},
    29: {name: "rogue", role: "DPS"},
    30: {name: "ninja", role: "DPS"},
    31: {name: "machinist", role: "DPS"},
    32: {name: "darkknight", role: "Tank"},
    33: {name: "astrologian", role: "Healer"},
    34: {name: "samurai", role: "DPS"},
    35: {name: "redmage", role: "DPS"},
    36: {name: "bluemage", role: "Limited"},
    37: {name: "gunbreaker", role: "Tank"},
    38: {name: "dancer", role: "DPS"},
    39: {name: "reaper", role: "DPS"},
    40: {name: "sage", role: "DPS"},
    41: {name: "viper", role: "DPS"},
    42: {name: "pictomancer", role: "DPS"},
};

const jobRoleOrder: Record<JobRole, number> = {
    "Tank": 1,
    "Healer": 2,
    "DPS": 3,
    "Limited": 4,
    "Crafter": 5,
    "Gatherer": 6,
};


const jobIcons = import.meta.glob("/src/assets/job/companion/*.png", {eager: true, query: "?url", import: "default"});

const fullJobMap: Record<number, Job> = {};
for (const jobID in jobDefinitions) {
    const definition = jobDefinitions[jobID as unknown as number];
    const iconPath = `/src/assets/job/companion/${definition.name}.png`;

    const rawIconUrl = jobIcons[iconPath];
    let iconUrl: string | null = null;

    if (typeof rawIconUrl === "string") {
        iconUrl = rawIconUrl;
    } else {
        console.warn(`icon for job '${definition.name}' (ID: ${jobID}) not found or not a string at path: ${iconPath}. [type: ${typeof rawIconUrl}]`);
    }

    fullJobMap[jobID as unknown as number] = {
        ...definition,
        iconUrl: iconUrl,
    };
}

/**
 * Retrieves the complete job object based on its identifier.
 * @param jobID The numerical identifier of the job.
 * @returns The Job object, or null if not found.
 */
export function getJobByID(jobID: number): Job | null {
    return fullJobMap[jobID] || null;
}

/**
 * Retrieves the complete job object based on its identifier.
 * @param jobID The numerical identifier of the job.
 * @returns The Job object, or null if not found.
 */
// export function getJobByID(jobID: number): Job | null {
//     return fullJobMap[jobID] || null;
// }

/**
 * Gets the URL for a job's icon based on its ID.
 * @param jobID The ID of the job.
 * @returns The public URL of the icon, or null if not found.
 */
export function getJobIconByID(jobID: number): string | null {
    return fullJobMap[jobID]?.iconUrl || null;
}

/**
 * Sorts an array of job IDs based on a predefined role hierarchy (Tank, Healer, DPS, etc.)
 * and then by job ID for jobs within the same role.
 * @param jobIDs An array of numerical job identifiers to be sorted.
 * @returns A new array of sorted job identifiers.
 */
// export function sortJobsByRole(jobIDs: number[]): number[] {
//     return [...jobIDs].sort((a, b) => {
//         const jobA = fullJobMap[a];
//         const jobB = fullJobMap[b];
//
//         // Handle cases where jobID might not be in fullJobMap
//         if (!jobA && !jobB) return 0;
//         if (!jobA) return 1;
//         if (!jobB) return -1;
//
//         const orderA = jobRoleOrder[jobA.role] || Infinity;
//         const orderB = jobRoleOrder[jobB.role] || Infinity;
//
//         if (orderA === orderB) {
//             return a - b;
//         }
//
//         return orderA - orderB;
//     });
// }

/**
 * Sorts the players within a Fight object based on their job role and then by job ID.
 *
 * @param fight The Fight object containing the players to be sorted.
 * @returns A new Fight object with player array sorted.
 */
export function sortPlayersInFight(fight: Fight): Fight {
    const sortedPlayers = [...fight.players].sort((playerA, playerB) => {
        const jobA = fullJobMap[playerA.job_id];
        const jobB = fullJobMap[playerB.job_id];

        if (!jobA && !jobB) return 0;
        if (!jobA) return 1;
        if (!jobB) return -1;

        const orderA = jobRoleOrder[jobA.role] || Infinity;
        const orderB = jobRoleOrder[jobB.role] || Infinity;

        if (orderA === orderB) {
            return playerA.job_id - playerB.job_id;
        }

        return orderA - orderB;
    });

    return {
        ...fight,
        players: sortedPlayers,
    };
}