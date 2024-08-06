import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import styles from "./SummarizedEntries.module.css";
//HOOKS
import { formatDate } from "@/custom-hooks/formatDate";
//FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter} from "@fortawesome/free-solid-svg-icons";
//COMPONENTS
import SearchBar from "../../UI/SearchBar"
import SummarizedCalendar from "./SummarizedCalendar";


const SummarizedEntries = (props) => {
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const currentDate = new Date();
  const [showAllThisYear, setShowAllThisYear] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Zustand für das Anzeigen von Einträgen des letzten Monats
  const [showLastMonth, setShowLastMonth] = useState(false);

  // Gefilterte und gruppierte/sortierte Einträge für den letzten Monat (wenn angezeigt)
  const lastMonthEntries = showLastMonth
    ? groupAndSortEntries(filterLastMonthEntries(allSupabaseSports))
    : {};

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

  return (
    <div className={`${isExpanded ? styles.expanded : ""}`}>
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
     
      <SummarizedCalendar filteredAndGroupedEntries={filteredAndGroupedEntries} currentDate={currentDate} />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {filteredCurrentMonthEntries &&
        filteredCurrentMonthEntries.map((entry, index) => (
          <div key={index} className={styles.searchEntries_div}>
            <h3 className={styles.title_days}>{entry.title}</h3>

            <div className="flex my-2 justify-between relative">
              <p className="m-2 mt-4"> {entry.entry}</p>
              <p className={styles.created_at}>
                {formatDate(entry.created_at)}
              </p>
            </div>
          </div>
        ))}

      <div className="my-6">
        {Object.keys(currentMonthEntries).map((date) => (
          <div key={date} className={styles.entries_div}>
            <h2 className={styles.title_days}>{formatDate(date)}</h2>
            {currentMonthEntries[date].map((entry) => {
              const createdAtDate = new Date(entry.created_at);
              const timeString = createdAtDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={entry.entryId}>
                  <p className="mb-1">
                    <span className="font-bold"> {entry.title} </span>-{" "}
                    {timeString} - ({entry.duration} min)
                  </p>
                </div>
              );
            })}
          </div>
        ))}

       
        <button
          onClick={() => setShowAllThisYear(!showAllThisYear)}
          className={styles.show_more_btn}
        >
          Show all entries this year
        </button>

        {showAllThisYear &&
          Object.keys(allThisYearEntries).map((date) => (
            <div key={date} className="my-4 p-2 bg-zinc-100">
              <h2>{formatDate(date)}</h2>
              {allThisYearEntries[date].map((entry) => {
                const createdAtDate = new Date(entry.created_at);
                const timeString = createdAtDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={entry.entryId}>
                    <p>
                      {entry.title} - {timeString}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default SummarizedEntries;



