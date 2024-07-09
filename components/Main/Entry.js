import Link from "next/link";

//STYLES
import styles from './Entry.module.css'
import { useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";
import { useState } from "react";




const Entry = (props) => {
  const currentSport = useSelector((state) => state.sport.selectedSport)
  const currentYear = useSelector((state) => state.calendar.year);
  const filteredByDate = props.filteredByDate;
  const formatDate = props.formatDate;
  const [openMonths, setOpenMonths] = useState({});

  function getMonth(created_at) {
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

    const date = new Date(created_at);
    const monthIndex = date.getMonth();

    return months[monthIndex];
  }

 const entriesByMonth = {};
 const entriesByDay = {};


 filteredByDate.forEach((entry) => {
   const monthYear = `${getMonth(entry.created_at)} `;
   //${new Date(entry.created_at).getFullYear()}

   if (!entriesByMonth[monthYear]) {
     entriesByMonth[monthYear] = [];
   }
   entriesByMonth[monthYear].push(entry);

   const dayMonthYear = `${new Date(entry.created_at).getDate()} ${getMonth(
     entry.created_at
   )} ${new Date(entry.created_at).getFullYear()}`;

   if (!entriesByDay[dayMonthYear]) {
     entriesByDay[dayMonthYear] = [];
   }

   entriesByDay[dayMonthYear].push(entry);
 });

 console.log(entriesByMonth);

 //const total =  entriesByMonth[monthYear].reduce((total, entry) => total + parseInt(entry.duration), 0) / 60

 function convertMinutesToHours(minutes) {
   const hours = Math.floor(minutes / 60);
   const remainingMinutes = minutes % 60;
   return `${hours}h ${remainingMinutes}m`;
 }

 const sumDurationsByMonth = {};
 for (const month in entriesByMonth) {
   const entries = entriesByMonth[month];
   const totalDurationInMinutes = entries.reduce(
     (acc, entry) => acc + entry.duration,
     0
   );
   const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);
   sumDurationsByMonth[month] = totalDurationInHours;
 }

  console.log(sumDurationsByMonth);

 
  const durationsArray = Object.entries(sumDurationsByMonth).map(
    ([month, duration]) => ({ [month]: duration })
  );

  console.log(durationsArray);




 

  const toggleMonthEntries = (monthYear) => {
    setOpenMonths((prevState) => ({
      ...prevState,
      [monthYear]: !prevState[monthYear],
    }));
  };






  return (
    <div className={styles.container}>
      {Object.keys(entriesByMonth).map((monthYear) => (
        <div key={monthYear}>
          {currentSport === "all" && (
            <button
              className={styles.monthYear_header}
              onClick={() => toggleMonthEntries(monthYear)}
            >
              {monthYear}
            </button>
          )}

          {openMonths[monthYear] &&
            entriesByMonth[monthYear].map((entry, index) => (
              <div
                className={styles.entry}
                key={index}
                style={{
                  background: getComputedStyle(
                    document.documentElement
                  ).getPropertyValue(`--${entry.label}`),
                }}
              >
                <Link href={`/details/${entry.entryPath}`}>
                  <div className={styles.link}>
                    <p className="my-2 px-2 text-xs absolute right-4">
                      {formatDate(entry.created_at)}
                    </p>
                    <h2 className="text-2xl mb-4 mt-2 px-2">{entry.title}</h2>
                    <p className="px-2 mb-4">{entry.entry}</p>
                  </div>
                </Link>
              </div>
            ))}
          {currentSport === "all" && (
            <p className={styles.totalHours_p}>
              Total hours of sport:{" "}
              <span className={styles.totalHours_span}>
                {" "}
                {sumDurationsByMonth[monthYear]}
              </span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Entry;



/*
const Entry = (props) => {
  const filteredByDate = props.filteredByDate;
  const formatDate = props.formatDate;

  // Gruppierung der Einträge nach Tagen
  const entriesByMonth = {};
  filteredByDate.forEach((entry) => {
    const monthYear = formatDate(entry.created_at).split(" ")[0]; // z.B. "April 2024"
    if (!entriesByMonth[monthYear]) {
      entriesByMonth[monthYear] = [];
    }
    entriesByMonth[monthYear].push(entry);
  });

  return (
    <div>
      {Object.keys(entriesByMonth).map((monthYear) => (
        <div key={monthYear}>
          <h2>{monthYear}</h2>
          {entriesByMonth[monthYear].map((entry, index) => (
            <div className={styles.entry} key={index}>
              <Link href={`/details/${entry.entryPath}`}>
                <div className={styles.link}>
                  <p className="my-2 px-2 text-xs absolute right-4">
                    {formatDate(entry.created_at)}
                  </p>
                  <h2 className="text-2xl mb-4 mt-2 px-2">{entry.title}</h2>
                  <p className="px-2 mb-4">{entry.entry}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Entry; */


/*
const Entry = (props) =>{

  const filteredByDate = props.filteredByDate
  const formatDate = props.formatDate


  return (
      <div>
        {filteredByDate.map((entry, index) => (
          <div className={styles.entry} key={index}>
            <Link href={`/details/${entry.entryPath}`}>
              <div className={styles.link}>
                <p className="my-2 px-2 text-xs absolute right-4">
                  {formatDate(entry.created_at)}
                </p>
                <h2 className="text-2xl mb-4 mt-2 px-2">{entry.title}</h2>
                <p className="px-2 mb-4"> {entry.entry}</p>
              </div>
            </Link>
          </div>
        ))}
        
      </div>
  );
}

export default Entry

*/


