function getFormattedDate(date: Date, locale: string) {
    const isZh = locale.toLowerCase().startsWith("zh");
    const currentYear = new Date().getFullYear();
    const isCurrentYear = date.getFullYear() === currentYear;

    if (isZh) {
        const m = date.getMonth() + 1;
        const d = date.getDate();

        // zh: auto hide year
        if (isCurrentYear) {
            return `${m} 月 ${d} 日`;
        } else {
            return `${date.getFullYear()} 年 ${m} 月 ${d} 日`;
        }
    }

    // en: auto hide year
    const options: Intl.DateTimeFormatOptions = isCurrentYear
        ? { month: "short", day: "numeric" } // Jan 6
        : { year: "numeric", month: "short", day: "numeric" }; // 2025 Jan 6

    return new Intl.DateTimeFormat(locale, options).format(date);
}

// time formatter based on locale
function getTimeFormatter(locale: string = "en-US") {
    const isZh = locale.toLowerCase().startsWith("zh");
    return new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        // zh: 24-hour, en: 12-hour
        hour12: !isZh,
    });
}

export function getTimeString(timestamp: string): [string, string] {
    const date = new Date(timestamp);
    const locale = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase().startsWith("america") ? "en-US" : navigator.language || "zh";
    const formatter = getTimeFormatter(locale);
    const dateStr = getFormattedDate(date, locale);
    return [formatter.format(date), dateStr];
}

function formatTimePartsLocal(date: Date, formatter: Intl.DateTimeFormat) {
    const parts = formatter.formatToParts(date);
    const hour = parts.find(p => p.type === "hour")?.value ?? "";
    const minute = parts.find(p => p.type === "minute")?.value ?? "";
    const dayPeriod = parts.find(p => p.type === "dayPeriod")?.value ?? "";
    return { hour, minute, dayPeriod };
}

export function getTimeRangeString(startTime: string, durationNs: number): [string, string] {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationNs / 1e6);

    const locale = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase().startsWith("america") ? "en-US" : navigator.language || "zh";
    const formatter = getTimeFormatter(locale);
    const isZh = locale.toLowerCase().startsWith("zh");

    const s = formatTimePartsLocal(start, formatter);
    const e = formatTimePartsLocal(end, formatter);

    const sHM = `${s.hour}:${s.minute}`;
    const eHM = `${e.hour}:${e.minute}`;

    const dateStr = getFormattedDate(start, locale);

    // zh: 24-hour format
    if (isZh) {
        return [`${sHM} - ${eHM}`, dateStr];
    }

    // en: same am/pm
    if (s.dayPeriod && e.dayPeriod && s.dayPeriod === e.dayPeriod) {
        return [`${sHM} - ${eHM} ${e.dayPeriod}`, dateStr];
    }

    // cross am/pm boundary or no am/pm
    const sFull = s.dayPeriod ? `${sHM} ${s.dayPeriod}` : formatter.format(start);
    const eFull = e.dayPeriod ? `${eHM} ${e.dayPeriod}` : formatter.format(end);
    return [`${sFull} - ${eFull}`, dateStr];
}

export function getTimeAgo(timestamp: string | number | Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) {
        return "刚刚";
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
        return `${diffMin} 分钟前`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
        return `${diffHour} 小时前`;
    }
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) {
        return `${diffDay} 天前`;
    }
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) {
        return `${diffMonth} 个月前`;
    }
    const diffYear = Math.floor(diffDay / 365);
    return `${diffYear} 年前`;
}

export function getDurationString(durationNs: number): string {
    const durationSec = Math.floor(durationNs / 1e9);
    const minutes = Math.floor(durationSec / 60);
    const seconds = durationSec % 60;
    if (minutes > 0) {
        return `${minutes} 分钟 ${seconds} 秒`;
    }
    return `${seconds} 秒`;
}
