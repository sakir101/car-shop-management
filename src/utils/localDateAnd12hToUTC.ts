export  const localDateAnd12hToUTC = (date: string, time: string) => {
  const [timePart, meridian] = time.split(" ");
  let [hour, minute] = timePart.split(":").map(Number);
  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;
  // Parse the date string (yyyy-mm-dd) and create date in local timezone
  const [year, month, day] = date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  // Convert to UTC ISO string for backend
  return localDate.toISOString();
};