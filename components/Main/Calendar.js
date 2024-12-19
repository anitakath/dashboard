import { useState, useEffect } from "react";
//STYLES
import styles from "./Calendar.module.css";
//REDUX
import { useDispatch, useSelector } from "react-redux";
import { updateDate } from "@/store/CalendarReducer";
//HOOKS
import useCalendar from "@/custom-hooks/useCalendar";
import { setSelectedSport } from "@/store/sportReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const Calendar = ({ filteredByDate }) => {
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
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

    if (currentMonth === "Okt") {
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
    if (selectedSport === "daily") {
      // Hier definieren wir die ID für jeden Monat
      const monthIds = {
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
        Dec: "DECEMBER",
      };

      // Wir holen uns die ID des Monats
      const monthId = monthIds[month];

      if (monthId) {
        // Hier scrollen wir zum Element mit der ID des Monats
        const element = document.getElementById(monthId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setSelectedMonth(month);
    dispatch(updateDate({ month, year: selectedYear }));
  };

  const switchAllHandler = (e) =>{
    if(e === "daily"){
      dispatch(setSelectedSport("daily"));
    } else if(e === "all"){
      dispatch(setSelectedSport("all"));
    }

  }




  return (
    <div className="w-full">
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
          <FontAwesomeIcon icon={faChevronDown} className={styles.icon} />
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
        <button className="secondary_button" onClick={() => switchAllHandler("daily")}>
          daily overview
        </button>
        <button className="secondary_button"  onClick={() => switchAllHandler("all")}>
          summary of all sports
        </button>
        <button className="secondary_button"  onClick={() => switchAllHandler("weekly")}>
          soon available: weekly goals 
        </button>
      </div>
    </div>
  );
};

export default Calendar;
