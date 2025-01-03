import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNavigation } from "@/store/sportReducer";

const useFetchEntries = (userId) => {

  //const dispatch = useDispatch()


  const extractUniqueSportsTitles = async(data) => {

    const uniqueTitlesSet = new Set();


    data.forEach(entry => {
        if (entry.title) {
            uniqueTitlesSet.add(entry.name); // Hier verwenden wir entry.name für die Sportarten
        }
    });

    // Konvertiere das Set zurück in ein Array
    return Array.from(uniqueTitlesSet);
};
  

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
        const sportsArray = await extractUniqueSportsTitles(filteredEntriesByUserId);

        //dispatch(setNavigation(sportsArray))

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

  const fetchAllSportsFromUser  = async(userId) =>{
    try{
       // Den userId als Query-Parameter an die API übergeben
       const response = await fetch(`/api/sports?userId=${userId}`);

       if (!response.ok) {
         throw new Error("Failed to fetch sports data");
       }
 
       const data = await response.json();
 
       if (data) {
        const uniqueItems = new Set(); // Set für einzigartige Kombinationen
        const newArray = [];

        data.data.forEach(item => {
          const key = `${item.label}-${item.name}`; // Eindeutiger Schlüssel

        if (!uniqueItems.has(key)) { // Überprüfen, ob der Schlüssel bereits existiert
              uniqueItems.add(key); // Schlüssel hinzufügen
              newArray.push({
                  color: item.label,
                  name: item.name
              });
          }
        });

      return newArray

      
       }

    } catch(error){
      console.error("Error fetching sports data:", error);
    }

  }


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

  return { fetchSportsData, fetchSportsDataBySelectedYear, fetchAllSportsFromUser  };
};

export default useFetchEntries;
