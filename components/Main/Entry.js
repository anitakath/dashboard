
import Link from "next/link";
//STYLES
import styles from './Entry.module.css'
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { formatDate } from "@/custom-hooks/formatDate";
//HOOKS
import useEntries from "@/custom-hooks/Entry/useEntries";
import { getMonth } from "@/custom-hooks/formatDate";
import { convertMinutesToHours } from "@/custom-hooks/minutesToHours";
import useSortedEntriesByMonth from "@/custom-hooks/useSortedEntriesByMonth"; // Importiere die neue Hook
//REDUX
import { setSortedEntriesByMonth } from "@/store/sportReducer";
//COMPONENTS
import EntriesByYearAndMonth from "./All/EntriesByYearAndMonth";


const Entry = ({ filteredByDate, filteredEntries, sportsDurationByMonth, allSupabaseSports }) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const dispatch = useDispatch();

  // SORTED OBJECTS AND ARRAYS FOR ENTRIESBYYEARANDMONTH; SELECTEDSPORT === "ALL"
  const { entriesByMonth, entriesByYearAndMonth } = useEntries(filteredByDate, allSupabaseSports);
  const sortedEntriesByMonth = useSortedEntriesByMonth(entriesByMonth);

  // always sort sortedEntriesByMonth by date of creation of the respective entries.

  if (sortedEntriesByMonth) {
    for (const month in sortedEntriesByMonth) {
      if (Array.isArray(sortedEntriesByMonth[month])) {
        const entriesCopy = [...sortedEntriesByMonth[month]];
        entriesCopy.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        sortedEntriesByMonth[month] = entriesCopy;
      }
    }
  }

  useEffect(() => {
    dispatch(setSortedEntriesByMonth(entriesByMonth));
  }, [allSupabaseSports, filteredEntries]);


  const sumDurationsByMonth = {};
  for (const month in entriesByMonth) {
    const entries = entriesByMonth[month];
    const totalDurationInMinutes = entries.reduce(
      (acc, entry) => acc + entry.duration,
      0
    );
    const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);
    sumDurationsByMonth[month] = totalDurationInHours;
  }

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

  // create a copy of filteredEntries, so filteredEntries is not mutated
  const sortedEntries = Array.isArray(filteredEntries)
    ? [...filteredEntries]
    : [];

  //sort the entries by .created_at
  sortedEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));



  return (
    <div className={styles.container}>
      {currentSport != "all" && (
        <h1>
          total hours of being a sporty spice so far:
          <span> {sportsDurationByMonth}</span>
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
                <h2 className="text-2xl mb-4 mt-6 px-2 h-18">{entry.title} </h2>
                <p className="px-2 mb-4">{entry.entry}</p>
              </div>
            </Link>
          </div>
        ))}

      <EntriesByYearAndMonth
        entriesByYearAndMonth={entriesByYearAndMonth}
        currentSport={currentSport}
        filteredEntries={filteredEntries}
        allSupabaseSports={allSupabaseSports}
      />
    </div>
  );
};

export default Entry;


