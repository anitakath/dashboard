





import Link from "next/link";
//STYLES
import styles from './Entry.module.css'
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { formatDate } from "@/custom-hooks/formatDate";
//HOOKS
import { getMonth } from "@/custom-hooks/formatDate";
import { convertMinutesToHours } from "@/custom-hooks/minutesToHours";
import useSortedEntriesByMonth from "@/custom-hooks/useSortedEntriesByMonth"; // Importiere die neue Hook
//REDUX
import { setSortedEntriesByMonth } from "@/store/sportReducer";
//COMPONENTS
import EntriesByYearAndMonth from "./All/EntriesByYearAndMonth";





const Entry = ({ filteredByDate, filteredEntries, sportsDurationByMonth }) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const [openMonths, setOpenMonths] = useState({});
  const [entriesByMonth, setEntriesByMonth] = useState({});
  const [entriesByYearAndMonth, setEntriesByYearAndMonth] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (filteredByDate) {
      const updatedEntriesByMonth = {};
      const updatedEntriesByDay = {};

      filteredByDate.forEach((entry) => {
        const monthYear = `${getMonth(entry.created_at)} `;
        if (!updatedEntriesByMonth[monthYear]) {
          updatedEntriesByMonth[monthYear] = [];
        }
        updatedEntriesByMonth[monthYear].push(entry);

        const dayMonthYear = `${new Date(
          entry.created_at
        ).getDate()} ${getMonth(entry.created_at)} ${new Date(
          entry.created_at
        ).getFullYear()}`;
        if (!updatedEntriesByDay[dayMonthYear]) {
          updatedEntriesByDay[dayMonthYear] = [];
        }
        updatedEntriesByDay[dayMonthYear].push(entry);
      });

      const sortedEntries = {};

      // Iteriere über jedes Datum im updatedEntriesByDay
      for (const date in updatedEntriesByDay) {
        const entries = updatedEntriesByDay[date];

        // Extrahiere Jahr, Monat und Tag aus dem Datum
        const [day, monthName, year] = date.split(" ");

        // Stelle sicher, dass das Jahr im sortedEntries existiert
        if (!sortedEntries[year]) {
          sortedEntries[year] = {};
        }

        // Stelle sicher, dass der Monat im Jahr existiert
        if (!sortedEntries[year][monthName]) {
          sortedEntries[year][monthName] = [];
        }

        // Füge die Einträge zum entsprechenden Jahr und Monat hinzu
        sortedEntries[year][monthName].push(...entries);
      }

      // Umwandeln des Objekts in das gewünschte Array-Format
      // Umwandeln des Objekts in das gewünschte Array-Format
      const finalSortedArray = Object.keys(sortedEntries)
        .filter((year) => year !== "1014") // Filtere das Jahr 1014 heraus
        .sort((a, b) => b - a) // Sortiere die Jahre in absteigender Reihenfolge
        .map((year) => ({
          [year]: Object.keys(sortedEntries[year]).map((month) => ({
            [month]: sortedEntries[year][month],
          })),
        }));

      setEntriesByYearAndMonth(finalSortedArray);
      // const final = useSortedEntriesByYearAndMonth(updatedEntriesByDay)
      //console.log(final)

      setEntriesByMonth(updatedEntriesByMonth);
    }
  }, [filteredByDate]);

  const sortedEntriesByMonth = useSortedEntriesByMonth(entriesByMonth);

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

  const toggleMonthEntries = (monthYear) => {
    setOpenMonths((prevState) => ({
      ...prevState,
      [monthYear]: !prevState[monthYear],
    }));
  };

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

  // always sort sortedEntriesByMonth by date of creation of the respective entries.

  if (sortedEntriesByMonth) {
    for (const month in sortedEntriesByMonth) {
      sortedEntriesByMonth[month].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    }
  }

  // create a copy of filteredEntries, so filteredEntries is not mutated
  const sortedEntries = Array.isArray(filteredEntries)
    ? [...filteredEntries]
    : [];

  //sort the entries by .created_at
  sortedEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  useEffect(() => {
    dispatch(setSortedEntriesByMonth(entriesByMonth));
  }, []);

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
                <h2 className="text-2xl mb-4 mt-6 px-2 h-18">{entry.title}</h2>
                <p className="px-2 mb-4">{entry.entry}</p>
              </div>
            </Link>
          </div>
        ))}

      <EntriesByYearAndMonth
        entriesByYearAndMonth={entriesByYearAndMonth}
        currentSport={currentSport}
        toggleMonthEntries={toggleMonthEntries}
        openMonths={openMonths}
      />
    </div>
  );
};

export default Entry;




/*

const Entry = ({ filteredByDate, filteredEntries, sportsDurationByMonth }) => {
    const currentSport = useSelector((state) => state.sport.selectedSport);
    const dispatch = useDispatch();

    const [entriesByMonth, setEntriesByMonth] = useState({});
    const [entriesByYearAndMonth, setEntriesByYearAndMonth] = useState(null);
    const [openMonths, setOpenMonths] = useState({});

    useEffect(() => {
        if (filteredByDate) {
            const updatedEntries = {};
            filteredByDate.forEach(entry => {
                const monthYear = `${getMonth(entry.created_at)} `;
                if (!updatedEntries[monthYear]) updatedEntries[monthYear] = [];
                updatedEntries[monthYear].push(entry);
            });
            setEntriesByMonth(updatedEntries);
            setEntriesByYearAndMonth(sortEntries(updatedEntries));
        }
    }, [filteredByDate]);

  const sortEntries = (entries) => {
    const sorted = {};

    Object.keys(entries).forEach(month => {
        entries[month].forEach(entry => {
            const year = new Date(entry.created_at).getFullYear();
            const monthName = getMonth(entry.created_at);

            if (!sorted[year]) {
                sorted[year] = {};
            }
            if (!sorted[year][monthName]) {
                sorted[year][monthName] = [];
            }
            sorted[year][monthName].push(entry);
        });
    });

    return Object.keys(sorted).map(year => ({
        year,
        months: Object.keys(sorted[year]).map(month => ({
            month,
            entries: sorted[year][month]
        }))
    }));
};

    const toggleMonthEntries = (monthYear) => {
        setOpenMonths(prev => ({ ...prev, [monthYear]: !prev[monthYear] }));
    };

    useEffect(() => {
        dispatch(setSortedEntriesByMonth(entriesByMonth));
    }, [entriesByMonth]);

    return (
        <div className={styles.container}>
            {currentSport !== "all" && (
                <h1>
                    Total hours of being a sporty spice so far: <span>{sportsDurationByMonth}</span>
                </h1>
            )}
            {filteredEntries && filteredEntries.map((entry, index) => (
                <div key={index} className={styles.entry} style={{ background: getComputedStyle(document.documentElement).getPropertyValue(`--${entry.label}`) }}>
                    <Link href={`/details/${entry.entryPath}`}>
                        <div className={styles.link}>
                            <p className="my-2 px-2 text-xs absolute right-4">{formatDate(entry.created_at)}</p>
                            <h2 className="text-2xl mb-4 mt-6 px-2 h-18">{entry.title}</h2>
                            <p className="px-2 mb-4">{entry.entry}</p>
                        </div>
                    </Link>
                </div>
            ))}
            <EntriesByYearAndMonth 
                entriesByYearAndMonth={entriesByYearAndMonth} 
                currentSport={currentSport} 
                toggleMonthEntries={toggleMonthEntries} 
                openMonths={openMonths} 
            />
        </div>
    );
};

export default Entry;

*/



