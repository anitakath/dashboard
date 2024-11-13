import { convertMinutesToHours } from "../minutesToHours";
import { useDispatch } from "react-redux";
//import { setFilteredEntriesByCurrentSport } from "@/store/sportReducer";


const useFilterAndSortEntries = () =>{
  //FILTER SPORT ENTRIES BY CURRENT SPORT





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

  //FILTER SPORT ENTRIES BY CURRENT SPORT - PT 2

  const filterEntriesByCurrentSportt = async (
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

    //dispatch(setFilteredEntriesByCurrentSport(filterEntries));
    return { filterEntries, totalDurationInMinutes, totalDurationInHours };
  };

  return {
    getFilteredEntriesByCurrentSport,
    filterEntriesByCurrentSportt,
  };
}

export default useFilterAndSortEntries