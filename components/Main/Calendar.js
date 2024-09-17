import { useState, useEffect } from "react";
//STYLES
import styles from "./Calendar.module.css";
//REDUX
import { useDispatch, useSelector } from "react-redux";
import { updateDate } from "@/store/CalendarReducer";
//HOOKS
import useCalendar from "@/custom-hooks/useCalendar";
import { setSelectedSport } from "@/store/sportReducer";

const Calendar = () => {
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const { getMonthStyle, months, useEntryCountForMonth } = useCalendar();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState("");
  const getEntryCountForMonth = useEntryCountForMonth(allSupabaseSports);

  useEffect(() => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });
    setSelectedMonth(currentMonth);
    dispatch(updateDate({ month: currentMonth, year: selectedYear }));
  }, [dispatch, selectedYear]);

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    dispatch(updateDate({ month: selectedMonth, year }));
  };

  const chooseMonthHandler = (month) => {
    setSelectedMonth(month);
    dispatch(updateDate({ month, year: selectedYear }));
  };

  const summarizeAllHandler = (e) => {
    e.preventDefault();
    dispatch(setSelectedSport("all"));
  };

  const dailyAllHandler = () => {
    dispatch(setSelectedSport("daily"));
  };

  return (
    <div className="p-0 mt-4 mb-4 w-full lg:w-2/3 relative">
      <h1 className="text-2xl my-2">
        Summary: <span className={styles.summary_span}>{selectedSport}</span>
      </h1>
      <div className={styles.buttons_div}>
        <button className="secondary_button" onClick={dailyAllHandler}>
          daily overview
        </button>
        <button className="secondary_button" onClick={summarizeAllHandler}>
          summary of all sports
        </button>
      </div>

      <div className={styles.chooseYear_div}>
        <p className="text-xs">choose year</p>
        <select
          name="year"
          id="year"
          className={styles.year_input}
          value={selectedYear}
          onChange={handleYearChange}
        >
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="my-4 p-0 grid grid-cols-3 gap-1">
        {months.map((month) => {
          const entryCount = getEntryCountForMonth(
            month,
            selectedYear,
            selectedSport
          );
          const monthStyle = getMonthStyle(entryCount);
          return (
            <div
              key={month}
              className={`${styles.month} ${
                selectedMonth === month ? styles.active : ""
              } ${monthStyle}`}
              onClick={() => chooseMonthHandler(month)}
            >
              <p>{month}</p>
              <p className={styles.amount}>{entryCount}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
