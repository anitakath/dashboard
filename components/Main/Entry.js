
import Link from "next/link";
import { useState } from "react";
//STYLES
import styles from './Entry.module.css'
import { useSelector, useDispatch } from "react-redux";
import { useEffect} from "react";
import { formatDate } from "@/custom-hooks/formatDate";
//HOOKS
import useEntries from "@/custom-hooks/Entry/useEntries";
import { convertMinutesToHours } from "@/custom-hooks/minutesToHours";
// Importiere die neue Hook
//REDUX
import { setSortedEntriesByMonth } from "@/store/sportReducer";
//COMPONENTS
import EntriesByYearAndMonth from "./All/EntriesByYearAndMonth";


const Entry = ({ filteredByDate, filteredEntries, allSupabaseSports }) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const dispatch = useDispatch();
  const [sortedEntries, setSortedEntries] = useState([]);

  //console.log(currentDate)
 // console.log(filteredEntries)

  // SORTED OBJECTS AND ARRAYS FOR ENTRIESBYYEARANDMONTH; SELECTEDSPORT === "ALL"
  const { entriesByMonth, entriesByYearAndMonth } = useEntries(filteredByDate, allSupabaseSports);

  useEffect(() => {
    dispatch(setSortedEntriesByMonth(entriesByMonth));
  }, [allSupabaseSports, filteredEntries]);


  const filteredEntriesByMonth = {};

  for (const month in entriesByMonth) {
    const uniqueDates = new Set();
    const filteredEntries = entriesByMonth[month].filter((entry) => {
      const date = entry.created_at.split("T")[0];
      if (!uniqueDates.has(date)) {
        uniqueDates.add(date);
        return true;
      }
      return false;
    });

    filteredEntriesByMonth[month] = filteredEntries;
  }



  useEffect(() => {
    const newSortedEntries = Array.isArray(filteredEntries)
      ? [...filteredEntries]
      : [];
    newSortedEntries.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    setSortedEntries(newSortedEntries);

    // Dispatch für die sortierten Einträge nach Monat
    dispatch(setSortedEntriesByMonth(entriesByMonth));
  }, [allSupabaseSports, filteredEntries]);


  // sort the entries by .created_at
  sortedEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const summedDurationPerSportPerMonth = sortedEntries.reduce((accumulator, entry) => {
      return accumulator + entry.duration;
  }, 0);

  // die gesamt Stundenanzahl an Sportstunden pro Sport im Monat X
  const summedDurationPerSportPerMonthInHours = convertMinutesToHours(summedDurationPerSportPerMonth)





  return (
    <div className={styles.container}>
      {currentSport != "all" && (
        <h1>
          total hours of being a sporty spice so far:
          <span> {summedDurationPerSportPerMonthInHours} </span>
        </h1>
      )}
      
      {currentSport !== "all" &&
        sortedEntries.map((entry, index) => (
          <div
            className={styles.entry}
            key={index}
            style={{
              background: getComputedStyle(
                document.documentElement
              ).getPropertyValue(`--${entry.label}`),
            }}
          >
            <Link href={`/details/${entry.entryPath}`}>
              <div className={styles.link}>
                <p className="my-2 px-2 text-xs absolute right-4">
                  {formatDate(entry.created_at)}
                </p>
                <h2 className="text-2xl mb-4 mt-6 px-2 h-18"> {entry.title} </h2>
                <p className="px-2 mb-4"> {entry.entry} </p>
              </div>
            </Link>
          </div>
        ))}

      <EntriesByYearAndMonth
        entriesByYearAndMonth={entriesByYearAndMonth}
        currentSport={currentSport}
      />
    </div>
  );
};

export default Entry;


