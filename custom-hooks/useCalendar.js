// useCalendar.js
import { useSelector } from "react-redux";
export const useEntryCountForMonth = (allSupabaseSports) => {
  return (month, selectedYear, selectedSport) => {
    if (!allSupabaseSports) {
      return 0;
    }

    if (selectedSport === "all") {


      // Create an object to group the entries by year and month
      const groupedEntries = {};

      allSupabaseSports.forEach((entry) => {
        const entryDate = new Date(entry.created_at);
        const entryYear = entryDate.getFullYear();

        // Change here from const to let
        let entryMonth = entryDate.toLocaleString("default", {
          month: "short",
        });

        // Conversion of the month to the abbreviation
        let monthAbbreviation = month.slice(0, 3);
        if (entryMonth === "Mär") {
          entryMonth = "Mar";
        }
        if (entryMonth === "Mai") {
          entryMonth = "May";
        }

        // Check whether the year and month match
        if (entryMonth === monthAbbreviation && entryYear === selectedYear) {
          const key = `${entryYear}-${entryMonth}`;
          if (!groupedEntries[key]) {
            groupedEntries[key] = [];
          }
          groupedEntries[key].push(entry);
        }
      });

      // Returns the number of entries for the specific month and year
      return Object.values(groupedEntries).reduce(
        (accum, group) => accum + group.length,
        0
      );
    } else {
      const filteredEntries = allSupabaseSports.filter((entry) => {
        const entryDate = new Date(entry.created_at);
        let entryMonth = entryDate.toLocaleString("default", {
          month: "short",
        });
        const entryYear = entryDate.getFullYear();
        const sportName = entry.name;

        let monthAbbreviation = month.slice(0, 3);
        if (entryMonth === "Mär") {
          entryMonth = "Mar";
        }
        if (entryMonth === "Mai") {
          entryMonth = "May";
        }

        return (
          entryMonth === monthAbbreviation &&
          entryYear === selectedYear &&
          sportName === selectedSport
        );
      });

      return filteredEntries.length;
    }
  };
};



//fix the error useGetMonthStyle is creating!!

export const useGetMonthStyle = () => {
  return (entryCount, styles) => {
    if (entryCount > 14) {
      return styles.maxixl;
    } else if (entryCount > 10) {
      return styles.maxi;
    } else if (entryCount > 6) {
      return styles.midi;
    } else if (entryCount > 4) {
      return styles.mini;
    } else if (entryCount > 0) {
      return styles.minixs;
    } else {
      return "";
    }
  };
};



  export const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

