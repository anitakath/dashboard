import Link from "next/link";
import { useState } from "react";
//STYLES
import styles from './Entry.module.css'
import { useSelector, useDispatch } from "react-redux";
import { useEffect} from "react";
import useFormatDate from "@/custom-hooks/times_and_dates/useFormatDate";
//HOOKS
import useEntries from "@/custom-hooks/Entry/useEntries";
import useConvertTimes from "@/custom-hooks/times_and_dates/useConvertTimes";
import useCalendar from "@/custom-hooks/times_and_dates/useCalendar";
// Importiere die neue Hook
//REDUX
import { setSortedEntriesByMonth } from "@/store/sportReducer";
import { updateDate } from "@/store/CalendarReducer";
//COMPONENTS
import EntriesByYearAndMonth from "./All/EntriesByYearAndMonth";
import { useDeleteSport } from "@/custom-hooks/useSportEntries";


const Entry = ({ filteredByDate, filteredEntries }) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const dispatch = useDispatch();
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const [sortedEntries, setSortedEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("")
  const year = useSelector((state) => state.calendar.year)
   const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  // SORTED OBJECTS AND ARRAYS FOR ENTRIESBYYEARANDMONTH; SELECTEDSPORT === "ALL"
  const { entriesByMonth, entriesByYearAndMonth } = useEntries(filteredByDate, allSupabaseSports);
  useEffect(() => {
    dispatch(setSortedEntriesByMonth(entriesByMonth));
  }, [allSupabaseSports, filteredEntries]);
  const { formatDate } = useFormatDate();
  const {currentMonth} = useCalendar()
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
 
    setSelectedMonth(currentMonth);

    dispatch(updateDate({ month: currentMonth, year: year }));
  }, [dispatch, year]);


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
  const {convertMinutesToHours} = useConvertTimes()
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
                <p className={styles.date}>
                  {formatDate(entry.created_at)} 
                </p>
                <h2 className={styles.title}> {entry.title} </h2>
                <p className={styles.description}> {entry.entry} </p>
                {entry.provider != null && <p className="mx-4 text-xs">{entry.provider}</p>}
                {entry.provider === null && <p className="mx-4 text-xs"> no provider was added</p>}
              </div>
            </Link>
          </div>
        ))}
        <div>
        {sortedEntries.length === 0 &&
            selectedSport != "all" &&
            (
              <p className="m-2 text-xl text-red-400 h-20 flex justify-center items-center"> no entries were made </p>
            )}
        </div>

        {currentSport === "all" && (
           <EntriesByYearAndMonth
           entriesByYearAndMonth={entriesByYearAndMonth}
           currentSport={currentSport}
         />
        )}

    </div>
  );
};

export default Entry;


