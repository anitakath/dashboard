import { useMemo } from "react";

const useSortedEntriesByYearAndMonth = (updatedEntriesByDay) => {
  return useMemo(() => {
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
    const finalSortedArray = Object.keys(sortedEntries)
      .filter((year) => year !== "1014") // Filtere das Jahr 1014 heraus
      .map((year) => ({
        [year]: Object.keys(sortedEntries[year]).map((month) => ({
          [month]: sortedEntries[year][month],
        })),
      }));

    console.log(finalSortedArray); // Optional: Logge das Ergebnis

    return finalSortedArray;
  }, [updatedEntriesByDay]);
};

export default useSortedEntriesByYearAndMonth;
