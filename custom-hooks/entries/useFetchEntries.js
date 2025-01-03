import { useState, useEffect } from "react";

const useFetchEntries = (userId) => {
  

  const fetchSportsData = async (userId) => {
    try {
      // Den userId als Query-Parameter an die API übergeben
      const response = await fetch(`/api/sports?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch sports data");
      }

      const data = await response.json();

      if (data) {
        const filteredEntriesByUserId = data.data; 
      
        const currentYear = new Date().getFullYear();
        const entriesInCurrentYear = filteredEntriesByUserId.filter(entry => {
        const entryYear = new Date(entry.created_at).getFullYear();
        return entryYear === currentYear;
      });
        return entriesInCurrentYear;
      }
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }

    return []; 
  };


  const fetchSportsDataBySelectedYear = async (userId, selectedYear) =>{
    try {
      const response = await fetch(`/api/sports?userId=${userId}`);
      if (!response.ok) {
          throw new Error("Failed to fetch sports data");
      }
      const data = await response.json();
      if (data) {
   
          const filteredEntriesByUserId = data.data;

          const entriesInSelectedYear = filteredEntriesByUserId.filter(entry => {
              const entryYear = new Date(entry.created_at).getFullYear();
 
              return entryYear === parseInt(selectedYear);
          });



          return entriesInSelectedYear; 
      }
  } catch (error) {
      console.error("Error fetching sports data:", error);
  }
  return [];
  }

  return { fetchSportsData, fetchSportsDataBySelectedYear  };
};

export default useFetchEntries;
