export const formatDate = (isoDate: string, showTime: boolean = false): string => {
  const date = new Date(isoDate);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);

  let formatted = `${day} ${month} ${year}`;

  if (showTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 => 12 for 12 AM
    formatted += ` ${hours}:${minutes} ${ampm}`;
  }

  return formatted;
};
