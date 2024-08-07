import { useState, useEffect } from 'react';
//STYLES 
import styles from './Calendar.module.css'
//FONTAWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateDate } from '@/store/CalendarReducer';
import { setSelectedSport } from '@/store/sportReducer';
//HOOKS
import { useEntryCountForMonth, useGetMonthStyle, months } from "@/custom-hooks/useCalendar"; // Importiere die neuen Hooks

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
 

  const getEntryCountForMonth = useEntryCountForMonth(allSupabaseSports);

   // make getMonthStyle in  useCalendar.js work!! 
  // add a style to the month-divs, depending on the number of entries
  const getMonthStyle = (entryCount) => {
    if(entryCount > 14){
      return styles.maxixl
    } else if (entryCount > 10) {
      return styles.maxi;
    } else if (entryCount > 6) {
      return styles.midi;
    } else if (entryCount > 4) {
      return styles.mini;
    } else if(entryCount > 0){
      return styles.minixs
    }else {
      return;
    }
  };
  

  useEffect(() => {
    const setMonthAndFilterSports = () => {
      dispatch(updateDate(date));
    };

    setMonthAndFilterSports();
  }, [date]);

  
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


  const summarizeAllHandler = (e) =>{
    e.preventDefault()
    dispatch(setSelectedSport('all'))
  }

  const dailyAllHandler = () =>{
     dispatch(setSelectedSport("daily"));
  }



  return (
    <div className="p-0 mt-4 mb-4  w-full lg:w-2/3 relative">
      <h1 className="text-2xl border-b-2 my-2">
        Summary: <span className={styles.summary_span}>{selectedSport} </span>
      </h1>

      <div className={styles.buttons_div}>
        <button className={styles.daily_allSports} onClick={dailyAllHandler}>
          daily overview
        </button>

        <button
          className={styles.summary_allSports}
          onClick={summarizeAllHandler}
        >
          summary of all sports
        </button>
      </div>

      <div className={styles.chooseYear_div}>
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
              className={`
                  ${styles.month} 
                  ${date.month === month ? styles.active : ""} 
                  ${date.month === month ? "" : monthStyle}
                  `}
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
}

export default Calendar