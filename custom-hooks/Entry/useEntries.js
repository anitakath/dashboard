import { useEffect, useState } from "react";
import { getMonth } from "@/utils/helpers";

const useEntries = (filteredByDate, allSupabaseSports) => {
  const [entriesByMonth, setEntriesByMonth] = useState({});
  const [entriesByYearAndMonth, setEntriesByYearAndMonth] = useState(null);


  
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
      for (const date in updatedEntriesByDay) {
        const entries = updatedEntriesByDay[date];
        const [day, monthName, year] = date.split(" ");

        if (!sortedEntries[year]) {
          sortedEntries[year] = {};
        }
        if (!sortedEntries[year][monthName]) {
          sortedEntries[year][monthName] = [];
        }
        sortedEntries[year][monthName].push(...entries);
      }

      // Definiere die richtige Reihenfolge der Monate
      const monthOrder = [
        "January ",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];





      function sortMonths(data) {
        const sortedData = {};

        for (const year in data) {
          if (data.hasOwnProperty(year)) {
            const months = data[year];
            const sortedMonths = {};

            // Sortiere die Monate nach der definierten Reihenfolge
            monthOrder.forEach((month) => {
              if (months[month]) {
                sortedMonths[month] = months[month];
              }
            });

            sortedData[year] = sortedMonths;
          }
        }
        return sortedData;
      }

      const sortedData = sortMonths(sortedEntries);


      // Filtere das Jahr 1014 heraus und sortiere die Jahre absteigend
      const finalSortedArray = Object.keys(sortedData)
  .filter((year) => year !== "1014")
  .sort((a, b) => b - a)
  .map((year) => {
    // Erstelle ein Array für die Monate mit Einträgen
    const sortedMonthsArray = [];

    // Iteriere über monthOrder und füge die Monate in der richtigen Reihenfolge hinzu
    for (const month of monthOrder) {
      const cleanMonth = month.trim(); // Entferne mögliche Leerzeichen

      if (sortedData[year][cleanMonth] && sortedData[year][cleanMonth].length > 0) {
        sortedMonthsArray.push({ [cleanMonth]: sortedData[year][cleanMonth] });
      }
    }

    return { [year]: sortedMonthsArray };
  });

setEntriesByYearAndMonth(finalSortedArray);
setEntriesByMonth(updatedEntriesByMonth);
    }

  }, [filteredByDate]);
  

  return { entriesByMonth, entriesByYearAndMonth };
};

export default useEntries;
