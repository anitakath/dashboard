// useSortedEntriesByMonth.js
import { useMemo } from "react";

const useSortedEntriesByMonth = (entriesByMonth) => {
  return useMemo(() => {
    const months = [
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

    const sortedEntriesByMonth = Object.entries(entriesByMonth)
      .sort(([monthA], [monthB]) => {
        return months.indexOf(monthB.trim()) - months.indexOf(monthA.trim());
      })
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    return sortedEntriesByMonth;
  }, [entriesByMonth]);
};

export default useSortedEntriesByMonth;
