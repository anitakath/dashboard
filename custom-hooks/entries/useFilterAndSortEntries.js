import { convertMinutesToHours } from "../minutesToHours";
import { setFilteredEntriesByCurrentSport } from "@/store/sportReducer";

const useFilterAndSortEntries = () =>{
  //FILTER SPORT ENTRIES BY CURRENT SPORT
  //ONLY WHEN USER LOGGED IN
  const getFilteredEntriesByCurrentSport = async (
    filteredEntriesByUserId,
    currentSport,
    currentDate
  ) => {
    const entries = filteredEntriesByUserId.filter(
      (sport) => sport.name === currentSport
    );

    const filterEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getFullYear() === currentDate.year &&
        entryDate.getMonth() + 1 === currentDate.month // Hier direkt currentDate.month verwenden
      );
    });

    //console.log(filterEntries);

    return filterEntries;
  };

  //FILTER SPORT ENTRIES BY CURRENT SPORT - PT 2
  //ONLY WHEN USER CHANGES SELECTED SPORT

  // filterEntriesByCurrentSportAndDate aus useAuth +  filterEntriesByCurrentSport zusammenfügen?!?!

  /*const filterEntriesBySportAndDate = async (filteredEntriesByUserId, currentSport, currentDate) => {
    console.log(filteredEntriesByUserId);
    console.log(currentSport);
    console.log(currentDate);

    // Filtere die Einträge nach dem aktuellen Sport
    const entries = filteredEntriesByUserId.filter((sport) => sport.name === currentSport);

    // Hilfsfunktion zum Ermitteln der Monatsnummer
    const getMonthNumber = (month) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(month) + 1;
    };

    // Filtere die Einträge nach Datum
    const filteredResults = entries.filter((entry) => {
        const entryDate = new Date(entry.created_at);
        return (
            entryDate.getFullYear() === currentDate.year &&
            entryDate.getMonth() + 1 === getMonthNumber(currentDate.month)
        );
    });

    // Berechne die Gesamtdauer in Minuten und Stunden
    const totalDurationInMinutes = filteredResults.reduce((total, entry) => total + entry.duration, 0);
    const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);

    // Optional: Hier kannst du die totalDurationInHours speichern oder verwenden
    console.log(`Total Duration in Hours: ${totalDurationInHours}`);

    // Rückgabe der gefilterten Ergebnisse und der Gesamtdauer
    return { filteredResults, totalDurationInMinutes, totalDurationInHours };
};*/

  const filterEntriesByCurrentSport = async (
    filteredEntriesByUserId,
    currentSport
  ) => {
    const currentDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1, // Monate sind nullbasiert, daher +1
      restDaysPerMonth: null,
    };
    
    const entries = await filteredEntriesByUserId.filter(
      (sport) => sport.name === currentSport
    );

    const filterEntries = await entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getFullYear() === currentDate.year &&
        entryDate.getMonth() + 1 === currentDate.month // Hier direkt currentDate.month verwenden
      );
    });

    const totalDurationInMinutes = await filterEntries.reduce(
      (total, entry) => total + entry.duration,
      0
    );

    const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);

    //console.log(filterEntries);
    return { filterEntries, totalDurationInMinutes, totalDurationInHours };
  };

  /*

  
  const filterEntriesByCurrentSportAndDate = async (
    filteredEntriesByUserId,
    currentSport,
    currentDate
  ) => {
    const entries = filteredEntriesByUserId.filter(
      (sport) => sport.name === currentSport
    );

    const getMonthNumber = (month) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(month) + 1;
    };

    const filteredResults = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getFullYear() === currentDate.year &&
        entryDate.getMonth() + 1 === getMonthNumber(currentDate.month)
      );
    });
    const totalDurationInMinutes = filteredResults.reduce(
      (total, entry) => total + entry.duration,
      0
    );
    const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);


    console.log(filteredResults)


    return{
        filteredResults
    }
  };
  */

  return {
    getFilteredEntriesByCurrentSport,
    filterEntriesByCurrentSport,
    //filterEntriesByCurrentSportAndDate,
  };
}

export default useFilterAndSortEntries