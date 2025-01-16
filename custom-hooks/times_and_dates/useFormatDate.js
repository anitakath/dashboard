const useFormatDate = () => {
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

  return { formatDateUS, formatDateUK, formatDateDE };
};

export default useFormatDate;