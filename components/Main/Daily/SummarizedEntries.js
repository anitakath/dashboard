import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SummarizedEntries.module.css";
//HOOKS
import { updateDate } from "@/store/CalendarReducer";
//FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter} from "@fortawesome/free-solid-svg-icons";
//COMPONENTS
import SearchBar from "../../UI/SearchBar"
import SummarizedCalendar from "./SummarizedCalendar";
import CurrentMonthEntries from "./CurrentMonthEntries";
import FilteredMonthEntries from "./FilteredMonthsEntries";

const SummarizedEntries = () => {
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDate = new Date();
  const [showAllThisYear, setShowAllThisYear] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const year = useSelector((state) => state.calendar.year)
  const month = useSelector((state) => state.calendar.month);
  const dispatch = useDispatch();

  const groupAndSortEntries = (entries) => {
    const groupedEntries = {};
    entries.forEach((entry) => {
      const createdAtDate = new Date(entry.created_at);
      const dayKey = createdAtDate.toISOString().split("T")[0]; // YYYY-MM-DD Format
      if (!groupedEntries[dayKey]) {
        groupedEntries[dayKey] = [];
      }
      groupedEntries[dayKey].push(entry);
    });
    return groupedEntries;
  };
  const filteredAndGroupedEntries = groupAndSortEntries(allSupabaseSports);

  const filterCurrentMonthEntries = (entries) => {
    return entries.filter((entry) => {
      const createdAtDate = new Date(entry.created_at);
      return (
        createdAtDate.getFullYear() === currentDate.getFullYear() &&
        createdAtDate.getMonth() === currentDate.getMonth()
      );
    });
  };

  // Funktion zum Filtern der Einträge nach dem letzten Monat
  const filterLastMonthEntries = (entries) => {
    return entries.filter((entry) => {
      const createdAtDate = new Date(entry.created_at);
      const lastMonthDate = new Date(currentDate);
      lastMonthDate.setMonth(currentDate.getMonth() - 1);

      return (
        createdAtDate.getFullYear() === lastMonthDate.getFullYear() &&
        createdAtDate.getMonth() === lastMonthDate.getMonth()
      );
    });
  };

  // Gefilterte und gruppierte/sortierte Einträge für den aktuellen Monat
  const currentMonthEntries = groupAndSortEntries(
    filterCurrentMonthEntries(allSupabaseSports)
  );



  // Funktion zum Filtern der Einträge des aktuellen Jahres, die nicht im aktuellen Monat sind
  const filterAllThisYearNotInCurrentMonthEntries = (entries) => {
    return entries.filter((entry) => {
      const createdAtDate = new Date(entry.created_at);
      return (
        createdAtDate.getFullYear() === currentDate.getFullYear() &&
        createdAtDate.getMonth() !== currentDate.getMonth()
      );
    });
  };

  // Einträge des aktuellen Jahres, wenn der Button geklickt wird
  const allThisYearEntries = showAllThisYear
    ? groupAndSortEntries(
        filterAllThisYearNotInCurrentMonthEntries(allSupabaseSports)
      )
    : {};

  // Funktion zum Filtern der Einträge des aktuellen Jahres
  const filterAllThisYearEntries = (entries) => {
    return entries.filter((entry) => {
      const createdAtDate = new Date(entry.created_at);
      return createdAtDate.getFullYear() === currentDate.getFullYear();
    });
  };


  // Filter all entries based on the search term
  const filterBySearchTerm = (entries) => {;
    if (!searchTerm){
      return; // If no search term was entered, return no entries
    }
    

    return entries.filter((entry) => {
      // Check whether title, name or entry contain the searchTerm
      return (
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.entry &&
          entry.entry.toLowerCase().includes(searchTerm.toLowerCase())) // Check that entry is not zero
      );
    });
  };

  const filteredCurrentMonthEntries = filterBySearchTerm(allSupabaseSports);

  const changeYear = (e) =>{
    if(e === "up"){
      dispatch(updateDate({year: year + 1, month}))
    } else if (e === "down"){
      dispatch(updateDate({year: year - 1, month}))
    }
  }


  return (
    <div className={`${isExpanded ? styles.expanded : ""}`}>

      <div className="flex items-center">
        <button
          className={styles.expand_btn}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {!isExpanded && (
            <FontAwesomeIcon
              icon={faUpRightAndDownLeftFromCenter}
              className={styles.expand_icon}
            />
          )}
          {isExpanded && (
            <FontAwesomeIcon
              icon={faDownLeftAndUpRightToCenter}
              className={styles.expand_icon}
            />
          )}
        </button>
        <div className="flex"> 
          <button className={styles.calendar_btn} onClick={()=> changeYear("down")}> 
            <FontAwesomeIcon icon={faCaretLeft} /> 
          </button>
          <p className={styles.calendar_year}>{year} </p>
          <button className={styles.calendar_btn} onClick={()=> changeYear("up")}> 
            <FontAwesomeIcon icon={faCaretRight} /> 
          </button>
        </div>
      </div>

      <SummarizedCalendar
        filteredAndGroupedEntries={filteredAndGroupedEntries}
        currentDate={currentDate}
      />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* the sports units filtered according to the search term */}
      <FilteredMonthEntries
        filteredCurrentMonthEntries={filteredCurrentMonthEntries}
      />

      {/* the sports units of the current month */}
      <CurrentMonthEntries
        currentMonthEntries={currentMonthEntries}
        showAllThisYear={showAllThisYear}
        setShowAllThisYear={setShowAllThisYear}
        allThisYearEntries={allThisYearEntries}
      />
    </div>
  );
};

export default SummarizedEntries;



