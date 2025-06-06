// useCalendar.js

import { useSelector } from "react-redux";
import styles from "../../components/Main/Calendar.module.css"; // Stelle sicher, dass der Pfad zu deinen Styles korrekt ist

const useCalendar = () => {
  const selectedSport = useSelector((state) => state.sport.selectedSport);

  const useEntryCountForMonth = (allSupabaseSports) => {
    return (month, selectedYear, selectedSport) => {
      if (!allSupabaseSports) {
        return 0;
      }

      if (selectedSport === "all" || selectedSport === "daily") {
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
          if (entryMonth === "Okt") {
            entryMonth = "Oct";
          }

          if (entryMonth === "Dez") {
            entryMonth = "Dec";
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
          if (entryMonth === "Okt") {
            entryMonth = "Oct";
          }

          if (entryMonth === "Dez") {
            entryMonth = "Dec";
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

  const getMonthStyle = (entryCount) => {
    if (selectedSport === "all" || selectedSport === "daily") {
      if (entryCount > 100) {
        return styles.maxixl;
      } else if (entryCount > 80) {
        return styles.maxi;
      } else if (entryCount > 50) {
        return styles.midi;
      } else if (entryCount > 40) {
        return styles.mini;
      } else if (entryCount > 0) {
        return styles.minixs;
      } else if(entryCount === 0){
        return styles.empty;
      }
    } else {
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
      } else if (entryCount === 0) {
        return styles.empty;
      }
    }
    return;
  };

  const months = [
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

  const completeMonths = [
    "January",
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
    "All",
  ];

  
  const monthAbbreviations = {
    Jan: "JANUARY",
    Feb: "FEBRUARY",
    Mar: "MARCH",
    Apr: "APRIL",
    May: "MAY",
    Jun: "JUNE",
    Jul: "JULY",
    Aug: "AUGUST",
    Sep: "SEPTEMBER",
    Oct: "OCTOBER",
    Nov: "NOVEMBER",
    Dec: "DECEMBER"
  };


  const getMonthsDays = (calendar) =>{

    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };
  
    const monthsInYear = [
      { name: "JANUARY", days: 31 },
      { name: "FEBRUARY", days: isLeapYear(calendar.year) ? 29 : 28 },
      { name: "MARCH", days: 31 },
      { name: "APRIL", days: 30 },
      { name: "MAY", days: 31 },
      { name: "JUNE", days: 30 },
      { name: "JULY", days: 31 },
      { name: "AUGUST", days: 31 },
      { name: "SEPTEMBER", days: 30 },
      { name: "OCTOBER", days: 31 },
      { name: "NOVEMBER", days: 30 },
      { name: "DECEMBER", days: 31 },
    ];

    return monthsInYear;
  }



  const currentDatee = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // Monate sind nullbasiert, daher +1
    restDaysPerMonth: null,
  };


  
  let currentMonth = new Date().toLocaleString("default", {
    month: "short",
  });

  if (currentMonth === "Okt") {
    currentMonth = "Oct";
  }

  if (currentMonth === "Dez") {
    currentMonth = "Dec";
  }


  return { getMonthStyle, currentMonth, months, completeMonths, monthAbbreviations, useEntryCountForMonth,  getMonthsDays, currentDatee };
};

export default useCalendar;
