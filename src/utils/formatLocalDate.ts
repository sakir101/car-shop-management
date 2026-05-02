import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatLocalDate = (date?: string ) => {
  if (!date) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // যদি ISO datetime হয়
  return dayjs.utc(date).local().format("YYYY-MM-DD");
};
