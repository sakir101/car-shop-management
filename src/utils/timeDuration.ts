export const parseTime = (timeString: string): Date | null => {
    try {
        const [time, modifier] = timeString.split(" "); // Split into time and AM/PM
        const [hours, minutes] = time.split(":").map(Number); // Split into hours and minutes
        let parsedHours = hours;

        if (modifier.toLowerCase() === "pm" && hours < 12) {
            parsedHours += 12; // Convert PM to 24-hour format
        } else if (modifier.toLowerCase() === "am" && hours === 12) {
            parsedHours = 0; // Handle 12 AM case
        }

        return new Date(`1970-01-01T${parsedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`);
    } catch {
        return null; // Return null for invalid time strings
    }
};

export function parseTime12HourToDate(timeStr:string) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
  
    if (modifier === "PM" && hours < 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
  
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  

export const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert back to 12-hour format

    return `${hours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
};

export const formatTo12HourTime = (isoString: any) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit" as const,
        minute: "2-digit" as const,
        hour12: true
    };
    return date.toLocaleTimeString("en-US", options);
};