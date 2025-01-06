import { convertMinutesToHours } from "../minutesToHours";
import { setFilteredEntriesByCurrentSportAndDate } from "@/store/sportReducer";
import useCalendar from "../useCalendar";
import { useDispatch } from "react-redux";
const useFilterAndSortEntries = () =>{
  const dispatch = useDispatch();
  const {months} = useCalendar();


  //FILTER SPORT ENTRIES BY CURRENT SPORT AND DATE
  const getFilteredEntriesByCurrentSportAndDate = async (
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

 const filterEntriesByCurrentSportAndDate = async (filteredEntriesByUserId, currentSport, currentDate) => {
    const entries = filteredEntriesByUserId.filter(
      (sport) => sport.name === currentSport
    );


    const getMonthNumber = (month) => months.indexOf(month) + 1; 


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
     dispatch(setFilteredEntriesByCurrentSportAndDate(filteredResults));
    
  };


  return {
    getFilteredEntriesByCurrentSportAndDate,
    filterEntriesByCurrentSportAndDate
  };
}

export default useFilterAndSortEntries