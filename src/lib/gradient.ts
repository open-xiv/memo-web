export const gradientLibs: string[] = [
    "bg-gradient-to-r from-red-500 to-orange-500",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-amber-500 to-pink-500",
    "bg-gradient-to-r from-emerald-400 to-cyan-400",
    "bg-gradient-to-r from-indigo-400 to-cyan-400",
    "bg-gradient-to-r from-fuchsia-600 to-pink-600",
];


function stringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

export function getTextGradient(text: string): string {
    if (!text || gradientLibs.length === 0) {
        return "bg-gray-200";
    }

    const hashValue = stringHash(text);
    const index = hashValue % gradientLibs.length;

    return gradientLibs[index];
}