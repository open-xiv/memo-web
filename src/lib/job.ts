const jobNameMap: Record<number, string> = {
    1: "gladiator",
    2: "pugilist",
    3: "marauder",
    4: "lancer",
    5: "archer",
    6: "conjurer",
    7: "thaumaturge",
    8: "carpenter",
    9: "blacksmith",
    10: "armorer",
    11: "goldsmith",
    12: "leatherworker",
    13: "weaver",
    14: "alchemist",
    15: "culinarian",
    16: "miner",
    17: "botanist",
    18: "fisher",
    19: "paladin",
    20: "monk",
    21: "warrior",
    22: "dragoon",
    23: "bard",
    24: "whitemage",
    25: "blackmage",
    26: "arcanist",
    27: "summoner",
    28: "scholar",
    29: "rogue",
    30: "ninja",
    31: "machinist",
    32: "darkknight",
    33: "astrologian",
    34: "samurai",
    35: "redmage",
    36: "bluemage",
    37: "gunbreaker",
    38: "dancer",
    39: "reaper",
    40: "sage",
    41: "viper",
    42: "pictomancer",
};

// Vite a specific way to handle dynamic assets using import.meta.glob
// This imports all matching modules and gives us a map of their paths to their URLs.
const jobIcons = import.meta.glob("/src/assets/job/companion/*.png", {eager: true, as: "url"});

/**
 * Gets the URL for a job's icon based on its ID.
 * @param jobID The ID of the job.
 * @returns The public URL of the icon, or null if not found.
 */
export function getJobIconByID(jobID: number): string | null {
    const jobName = jobNameMap[jobID];
    if (!jobName) {
        console.warn(`Job with ID ${jobID} not found in the map.`);
        // You might want to return a default 'unknown job' icon URL here
        return null;
    }

    const iconPath = `/src/assets/job/companion/${jobName}.png`;
    const iconUrl = jobIcons[iconPath];

    if (!iconUrl) {
        console.warn(`Icon for job '${jobName}' (ID: ${jobID}) not found at path: ${iconPath}`);
        return null;
    }

    return iconUrl;
}

