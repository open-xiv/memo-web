const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
});

const dateFormat = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
});

export function getTimeString(timestamp: string): [string, string] {
    const date = new Date(timestamp);
    return [timeFormat.format(date), dateFormat.format(date)];
}

function formatTimePartsLocal(date: Date) {
    const parts = timeFormat.formatToParts(date);
    const hour = parts.find(p => p.type === "hour")?.value ?? "";
    const minute = parts.find(p => p.type === "minute")?.value ?? "";
    const dayPeriod = parts.find(p => p.type === "dayPeriod")?.value ?? "";
    return { hour, minute, dayPeriod };
}

export function getTimeRangeString(startTime: string, durationNs: number): [string, string] {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationNs / 1e6);

    const s = formatTimePartsLocal(start);
    const e = formatTimePartsLocal(end);

    const sHM = `${s.hour}:${s.minute}`;
    const eHM = `${e.hour}:${e.minute}`;

    // same am/pm
    if (s.dayPeriod && e.dayPeriod && s.dayPeriod === e.dayPeriod) {
        return [`${sHM} - ${eHM} ${e.dayPeriod}`, dateFormat.format(start)];
    }

    // cross am/pm boundary or no am/pm
    const sFull = s.dayPeriod ? `${sHM} ${s.dayPeriod}` : timeFormat.format(start);
    const eFull = e.dayPeriod ? `${eHM} ${e.dayPeriod}` : timeFormat.format(end);
    return [`${sFull} - ${eFull}`, dateFormat.format(start)];
}
