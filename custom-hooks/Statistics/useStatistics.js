// hooks/useStatistics.js
import { useMemo } from "react";
import { convertMinutesToHours } from "@/custom-hooks/minutesToHours";



const useStatistics = (allSupabaseSports, date) => {
  const filteredSports = useMemo(() => {
    return allSupabaseSports.filter((sport) => {
      const sportYear = new Date(sport.created_at).getFullYear();
      return sportYear === date.year;
    });
  }, [allSupabaseSports, date]);

  const sportCount = useMemo(() => {
    return filteredSports.reduce((acc, sport) => {
      if (!acc[sport.name]) {
        acc[sport.name] = { count: 0, label: sport.label };
      }
      acc[sport.name].count += 1;
      return acc;
    }, {});
  }, [filteredSports]);

  const sortedSportsByCount = useMemo(() => {
    return Object.entries(sportCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3);
  }, [sportCount]);

  const durationSums = useMemo(() => {
    return filteredSports.reduce((acc, sport) => {
      if (!acc[sport.name]) {
        acc[sport.name] = { totalDuration: 0, label: sport.label };
      }
      acc[sport.name].totalDuration += sport.duration;
      return acc;
    }, {});
  }, [filteredSports]);

  const resultArray = useMemo(() => {
    return Object.entries(durationSums).map(
      ([name, { totalDuration, label }]) => ({
        name,
        totalDuration,
        label,
        totalDurationFormatted: convertMinutesToHours(totalDuration),
      })
    );
  }, [durationSums]);

  // Funktion zur Berechnung der Restdays
  // Funktion zur Berechnung der Restdays
  const calculateRestDays = () => {
    const year = date.year; // Verwende das Jahr aus dem Date-Objekt
    const restDaysCount = {};

    // Initialisiere alle Monate mit 0 Restdays (auf Englisch)
    const monthNames = [
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
    ];

    monthNames.forEach((month) => {
      restDaysCount[month] = 0;
    });

    // Erstelle ein Set von Tagen, an denen Einträge existieren
    const daysWithEntries = new Set();

    filteredSports.forEach((entry) => {
      const createdAtDate = new Date(entry.created_at);
      daysWithEntries.add(createdAtDate.toISOString().split("T")[0]); // YYYY-MM-DD Format
    });

    // Zähle die Restdays für jeden Monat
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // Anzahl der Tage im Monat
      let restDays = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = `${year}-${String(month + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;
        if (!daysWithEntries.has(currentDate)) {
          restDays++;
        }
      }

      restDaysCount[monthNames[month]] = restDays; // Setze die Restdays für den entsprechenden englischen Monat
    }

    return restDaysCount;
  };

  // Berechne die Restdays und speichere sie in einer Memoized Variable
  const restDaysPerMonth = useMemo(calculateRestDays, [filteredSports]);


  return { sortedSportsByCount, resultArray, restDaysPerMonth };
};

export default useStatistics;
