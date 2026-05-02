// components/DateDisplay.tsx
import React from "react";

interface DateDisplayProps {
  date?: string | Date | null;
  fallback?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  fallback = "N/A",
  formatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
}) => {
  if (!date) return <>{fallback}</>;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return <>{fallback}</>;

  return <>{parsedDate.toLocaleDateString("en-GB", formatOptions)}</>;
};

export default DateDisplay;
