export const formatChatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) return dateString;

    const isToday = date.toDateString() === now.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'p.m' : 'a.m';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutesStr} ${ampm}`;
    } else if (isThisYear) {
        // Format: 01.02 (Month.Day)
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const monthStr = month < 10 ? '0' + month : month;
        const dayStr = day < 10 ? '0' + day : day;
        return `${monthStr}.${dayStr}`;
    } else {
        // Format: 2025.07.05 (Year.Month.Day)
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const monthStr = month < 10 ? '0' + month : month;
        const dayStr = day < 10 ? '0' + day : day;
        return `${year}.${monthStr}.${dayStr}`;
    }
};
