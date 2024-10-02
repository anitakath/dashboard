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
    let currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });

    if (currentMonth  === "Okt") {
      currentMonth = "Oct";
    }

    if (currentMonth === "Dez") {
      currentMonth = "Dec";
    }
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
    <div className="w-full lg:w-2/3">
      <div className={styles.calendar_div} id="calendar">
        <h1 className={styles.calendar_header}>
          Overview: <span className={styles.summary_span}>{selectedSport}</span>
        </h1>

        <div className={styles.chooseYear_div}>
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
        <div className="mb-4 p-0 grid grid-cols-3 gap-1">
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

      <div className={styles.buttons_div}>
        <button className="secondary_button" onClick={dailyAllHandler}>
          daily overview
        </button>
        <button className="secondary_button" onClick={summarizeAllHandler}>
          summary of all sports
        </button>
      </div>
    </div>
  );
};

export default Calendar;
