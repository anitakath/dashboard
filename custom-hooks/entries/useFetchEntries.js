import { setAllPlannedSports } from "@/store/sportReducer";
import { supabase } from "@/services/supabaseClient";
const useFetchEntries = (userId) => {

 //FETCH ENTRIES IN CURRENT YEAR BUT ALSO EXTRACT UNIQUE SPORTS TITLE (FOR NAVIGATION?)
  const fetchSportsData = async (userId, currentSport, currentDate) => {

    try {
      // userId und year als Query-Parameter an die API übergeben um Einträge hiernach filtern zu können
      const year = currentDate.year;
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      //const response = await fetch(`/api/sports?userId=${userId}&year=${year}`);

      const response = await fetch(`/api/sports?userId=${userId}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sports data");
      }

      const data = await response.json();

      if (data) {
        const entriesInCurrentYear = data.data;
        return entriesInCurrentYear;
      }
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
    return []; 
  };

  const fetchPlannedSports = async (userId, currentYear, dispatch) => {
    try {

      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      const response = await fetch(`/api/plannedSports?userId=${userId}&year=${currentYear}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch(setAllPlannedSports(data.data));
    } catch (error) {
      console.error("Error fetching planned sports:", error);
    }
  };


  /** FOLGENDE KOMPONENTE MUSS ENTFERNT WERDEN! CSELECTTIMEPERIOD.JS NUTZT SIE NOCH, MÖCHTE DASS FETCHSPORTSDATA GENUTZT WIRD */

  //FETCH ENTRIES IN SELECTED YEAR
  const fetchSportsDataBySelectedYear = async (userId, selectedYear) =>{


    try {
      const response = await fetch(`/api/sports?userId=${userId}&year=${selectedYear}`);
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










  







  // FETCH ENTRIES OF ALL YEARS
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

  return { fetchSportsData, fetchPlannedSports,  fetchSportsDataBySelectedYear, fetchAllSportsFromUser, };
};

export default useFetchEntries;
