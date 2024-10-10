
export const convertMinutesToHours = (minutes) => {
  return (minutes / 60).toFixed(2);
};

export const getMonth = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long" });
};

