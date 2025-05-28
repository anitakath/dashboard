
const useFetchEntries = (userId) => {

 //FETCH ENTRIES IN CURRENT YEAR BUT ALSO EXTRACT UNIQUE SPORTS TITLE (FOR NAVIGATION?)
  const fetchSportsData = async (userId, currentSport, currentDate) => {
    try {
      // userId und year als Query-Parameter an die API übergeben um Einträge hiernach filtern zu können
      const year = currentDate.year;
      const response = await fetch(`/api/sports?userId=${userId}&year=${year}`);

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


  /** FOLGENDE KOMPONENTE MUSS ENTFERNT WERDEN! CALENDAR.JS && ENTRIESBYYEARANDMONTH NUTZEN SIE NOCH, MÖCHTE DASS FETCHSPORTSDATA GENUTZT WIRD */

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

  

  return { fetchSportsData,  fetchSportsDataBySelectedYear, fetchAllSportsFromUser, };
};

export default useFetchEntries;
