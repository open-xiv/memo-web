export function getTimeString(timestamp: string): string[] {
    const date = new Date(timestamp);

    // time (11:00:12 AM)
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds.toString();

    const timeString = `${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

    // date (June 1st 2023)
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let daySuffix;
    if (day > 3 && day < 21) {
        daySuffix = "th";
    } else {
        switch (day % 10) {
            case 1:
                daySuffix = "st";
                break;
            case 2:
                daySuffix = "nd";
                break;
            case 3:
                daySuffix = "rd";
                break;
            default:
                daySuffix = "th";
                break;
        }
    }

    const dateString = `${month} ${day}${daySuffix} ${year}`;

    return [timeString, dateString];
}