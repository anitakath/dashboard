import { useState, useEffect } from 'react';

//STYLES 
import styles from './Calendar.module.css'

//FONTAWESOME

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateDate } from '@/store/CalendarReducer';

const Calendar = (props) =>{
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );

  const selectedSport = useSelector((state) => state.sport.selectedSport);

  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear); 
  const [selectedMonth, setSelectedMonth] = useState(""); 

  const [date, setDate] = useState({
    month: selectedMonth,
    year: selectedYear,
  });

  //filter the entries by month, year and sport from allSupabaseSports
  const getEntryCountForMonth = (month, selectedYear, selectedSport) => {
    return allSupabaseSports.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      const entryMonth = entryDate.toLocaleString("default", {
        month: "short",
      });
      const entryYear = entryDate.getFullYear();
      const sportName = entry.name;

      const monthAbbreviation = month.slice(0, 3); 

      return (
        entryMonth === monthAbbreviation &&
        entryYear === selectedYear &&
        sportName === selectedSport
      );
    }).length;
  };

  const getMonthStyle = (entryCount) => {
    if (entryCount > 8) {
      return styles.maxi;
    } else if (entryCount > 4) {
      return styles.midi;
    } else if (entryCount > 0) {
      return styles.mini;
    } else {
      return;
    }
  };

  useEffect(() => {
    const setMonthAndFilterSports = () => {
      dispatch(updateDate(date));
    };

    setMonthAndFilterSports();
  }, [date]);

  function formatDate(dateString) {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);

    return date.toLocaleDateString("de-DE", options).replace(",", "");
  }

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));

    const year = parseInt(e.target.value);

    setDate((prevDate) => ({
      ...prevDate,
      year: year,
    }));
  };

  const chooseMonthHandler = (month) => {
    setSelectedMonth(month);

    setDate((prevDate) => ({
      ...prevDate,
      month: month,
    }));
  };

  useEffect(() => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "short",
    });

    setDate((prevDate) => ({
      ...prevDate,
      month: currentMonth,
    }));
  }, []);

  return (
    <div className="p-4 mt-4 ml-1 mb-4 w-1/3 relative  ">
      <h1 className="text-2xl  border-b-2 my-2"> Summary </h1>

      <div className="absolute right-6 top-4 p-2 flex items-center">
        <p className="text-xs">choose year</p>
        <select
          name="year"
          id="year"
          className={styles.year_input}
          defaultValue={currentYear}
          onChange={handleYearChange}
        >
          <option value="2023"> 2023</option>
          <option value="2024"> 2024</option>
          <option value="2025"> 2025</option>
          <option value="2026"> 2026</option>
        </select>
      </div>

      <div className="flex items-center">
        <button className={"text-xl my-2 mx-1"}>
          <FontAwesomeIcon icon={faChevronLeft} className={styles.chevron} />
        </button>
        <button className=" text-xl my-2">
          <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
        </button>
        <p className="ml-10 w-full text-2xl">
          {" "}
          <span className="text-xs ">selected year:</span> {selectedYear}{" "}
        </p>
      </div>

      <div className="my-4 p-0 grid grid-cols-3 gap-1">
        {[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mai",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].map((month) => {
          const entryCount = getEntryCountForMonth(
            month,
            selectedYear,
            selectedSport
          );
          const monthStyle = getMonthStyle(entryCount);

          return (
            <div
              key={month}
              className={`
                  ${styles.month} 
                  ${date.month === month ? styles.active : ""} 
                  ${date.month === month ? "" : monthStyle}
                  `}
              onClick={() => chooseMonthHandler(month)}
            >
              {month}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar