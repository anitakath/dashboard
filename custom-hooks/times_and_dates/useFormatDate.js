const useFormatDate = () => {

  const formatDate = (dateString) =>{
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

  return{formatDate}
 
}

export default useFormatDate



