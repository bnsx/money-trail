export function formatDateAndTime(dateString: Date | string ): string {
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
