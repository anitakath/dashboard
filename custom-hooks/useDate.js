// custom-hooks/useDate.js
import { useState } from "react";

export const useHandleYearChange = (initialYear) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);

  const handleYearChange = (year, setIsYearModalOpen, setDate) => {
    setSelectedYear(year);
    setIsYearModalOpen(false);
    setDate((prevDate) => ({ ...prevDate, year }));
  };

  return [selectedYear, handleYearChange];
};

export const useHandleMonthChange = (initialMonth) => {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const handleMonthChange = (month, setIsMonthModalOpen, setDate) => {
    setSelectedMonth(month);
    setIsMonthModalOpen(false);
    setDate((prevDate) => ({ ...prevDate, month }));
  };

  return [selectedMonth, handleMonthChange];
};
