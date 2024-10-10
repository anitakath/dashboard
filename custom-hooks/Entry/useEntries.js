
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSortedEntriesByMonth } from "@/store/sportReducer";
import { getMonth } from "@/utils/helpers";
const useEntries = (filteredByDate, allSupabaseSports) => {
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

      const finalSortedArray = Object.keys(sortedEntries)
        .filter((year) => year !== "1014") // Filtere das Jahr 1014 heraus
        .sort((a, b) => b - a) // Sortiere die Jahre in absteigender Reihenfolge
        .map((year) => ({
          [year]: Object.keys(sortedEntries[year]).map((month) => ({
            [month]: sortedEntries[year][month],
          })),
        }));

      setEntriesByYearAndMonth(finalSortedArray);

      setEntriesByMonth(updatedEntriesByMonth);
    }
  }, [filteredByDate, allSupabaseSports]);

  return { entriesByMonth, entriesByYearAndMonth };
};

export default useEntries;
