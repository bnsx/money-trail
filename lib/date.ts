export function formatDate(dateString: Date | string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
        // hour12: false,
        timeZone: "Asia/Bangkok", // Use the timezone of Thailand (Asia/Bangkok)
    };

    return new Intl.DateTimeFormat("th-TH", options).format(date);
}

export function toUnixTime(data: Date | string | undefined) {
    if (data === undefined) {
        return undefined;
    }
    return Math.floor(new Date(data).getTime() / 1000);
}
export function toDateTime(data: number | undefined) {
    if (typeof data === "undefined") {
        return undefined;
    }
    return new Date(data * 1000);
}
