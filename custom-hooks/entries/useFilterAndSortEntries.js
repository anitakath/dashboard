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

    return filterEntries;
  };


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
    return { filterEntries, totalDurationInMinutes, totalDurationInHours };
  };



 

  return {
    getFilteredEntriesByCurrentSport,
    filterEntriesByCurrentSport,
  };
}

export default useFilterAndSortEntries