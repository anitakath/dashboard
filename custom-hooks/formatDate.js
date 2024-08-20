export function formatDate(dateString) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", // Behalte die Zeit in UTC
  };
  const date = new Date(dateString);
  return date.toLocaleString("de-DE", options).replace(",", "");
}


export function getMonth(created_at) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(created_at);

  const monthIndex = date.getMonth();

  return months[monthIndex];
}

 export const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

