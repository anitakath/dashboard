
import { useState, useEffect } from 'react';

//STYLES 
import styles from './Calendar.module.css'

//FONTAWESOME

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faUser, faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddEntryForm from "./AddEntryForm";
import { current } from "@reduxjs/toolkit";




//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { updateDate } from '@/store/CalendarReducer';
const Calendar = () =>{

   const dispatch = useDispatch();
   const currentYear = new Date().getFullYear(); // Aktuelles Jahr ermitteln
   const [selectedYear, setSelectedYear] = useState(currentYear); // useState für das ausgewählte Jahr
   const [selectedMonth, setSelectedMonth] = useState(""); // useState für den ausgewählten Monat

   const [date, setDate] = useState({
     month: selectedMonth,
     year: selectedYear,
   });



   useEffect(()=>{

      
    const setMonthAndFilterSports = () => {
     
      dispatch(updateDate(date));
    };

    setMonthAndFilterSports()


   }, [date])

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
      setSelectedYear(parseInt(e.target.value)); // Das ausgewählte Jahr aktualisieren
    };

    const chooseMonthHandler = (month) => {
      setSelectedMonth(month);

      setDate((prevDate) => ({
        ...prevDate,
        month: month,
      }));



      
    };

  
    const actualDate = useSelector((state)=> state.calendar)





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
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month) => (
            <div
              key={month}
              className={`${styles.month} ${
                date.month === month ? styles.active : ""
              }`}
              onClick={() => chooseMonthHandler(month)}
            >
              {month}
            </div>
          ))}
        </div>
      </div>
    );
}

export default Calendar