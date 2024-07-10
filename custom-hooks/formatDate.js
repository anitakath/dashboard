export function formatDate(dateString) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const date = new Date(dateString);

  return date.toLocaleDateString("de-DE", options).replace(",", "");
}
