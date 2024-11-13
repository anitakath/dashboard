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
        // Da wir bereits in der API gefiltert haben, können wir hier einfach die Daten zurückgeben
        const filteredEntriesByUserId = data.data; // Die API gibt bereits gefilterte Daten zurück

        return filteredEntriesByUserId; // Rückgabe des gefilterten Arrays
      }
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }

    return []; // Rückgabe eines leeren Arrays im Fehlerfall
  };

  return { fetchSportsData  };
};

export default useFetchEntries;
