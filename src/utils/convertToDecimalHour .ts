export const convertToDecimalHour = (timeString: string) => {
  const [h, m] = timeString.split(":").map(Number);
  return (h + m / 60).toFixed(2);
};