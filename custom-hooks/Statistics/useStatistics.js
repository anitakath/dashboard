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

  return { sortedSportsByCount, resultArray };
};

export default useStatistics;
