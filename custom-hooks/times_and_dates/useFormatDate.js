const useFormatDate = () => {

    const formatDate = (dateString) => {
        const options = { 
            day: "2-digit", 
            month: "long", // Vollständiger Monatsname
            year: "numeric" 
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options); // Amerikanisches Datumsformat
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0'); 
        const minutes = String(date.getMinutes()).padStart(2, '0'); 
        return `${hours}:${minutes}`; 
    };




  const formatDateUS = (dateString) => {
      const options = { 
          day: "2-digit", 
          month: "long", 
          year: "numeric" 
      };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", options); // US-Format: January 15, 2025
  };

  const formatDateUK = (dateString) => {
      const options = { 
          day: "2-digit", 
          month: "long", 
          year: "numeric" 
      };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", options); // UK-Format: 15 January 2025
  };

  const formatDateDE = (dateString) => {
      const options = { 
          day: "2-digit", 
          month: "long", 
          year: "numeric" 
      };
      const date = new Date(dateString);
      return date.toLocaleDateString("de-DE", options); // DE-Format: 15. Januar 2025
  };

  return { formatDate,formatTime, formatDateUS, formatDateUK, formatDateDE };
};

export default useFormatDate;