import Link from "next/link";
import styles from './SummarizedEntries.module.css'
import Calendar from "../Calendar";
//REDUX
import { useSelector } from "react-redux";
//CUSTOM HOOKS
import useCalendar from "../../../custom-hooks/useCalendar";


const SummarizedCalendar = (props) => {
  const currentDate = props.currentDate;
  const filteredAndGroupedEntries = props.filteredAndGroupedEntries;

  const renderCalendar = () => {
      const monthsInYear = [
          { name: "JANUARY", days: 31 },
          { name: "FEBRUARY", days: 29 },
          { name: "MARCH", days: 31 },
          { name: "APRIL", days: 30 },
          { name: "MAY", days: 31 },
          { name: "JUNE", days: 30 },
          { name: "JULY", days: 31 },
          { name: "AUGUST", days: 31 },
          { name: "SEPTEMBER", days: 30 },
          { name: "OCTOBER", days: 31 },
          { name: "NOVEMBER", days: 30 },
          { name: "DECEMBER", days: 31 },
      ];

      const chosenMonth = useSelector((state) => state.calendar.month);
      const {monthAbbreviations} = useCalendar()

  

      return (
          <div className={styles.calendar_div}>
            
              <Calendar />
              {monthsInYear.map((month, monthIndex) => {
                  // Überprüfen, ob der aktuelle Monat aktiv ist
                  
                  const isActiveMonth = month.name === monthAbbreviations[chosenMonth];

                  return (
                      <div key={month.name} className={`${styles.month} ${isActiveMonth ? styles.activeMonth : ""}`} id={month.name}>
                          <h3 className={styles.title}>{month.name}</h3>
                          <div className={styles.days}>
                              {[...Array(month.days)].map((_, dayIndex) => {
                                  const dayNumber = dayIndex + 1;
                                  const dateString = `${new Date(currentDate.getFullYear(), monthIndex, dayNumber).toISOString().split("T")[0]}`;
                                  const isToday = new Date().toISOString().split("T")[0] === dateString;

                                  return (
                                      <div key={dayNumber} className={`${styles.day} ${isToday ? styles.today : ""}`}>
                                          <Link className={styles.day_date} href={`/daily-details/${dayNumber}${month.name}`}>
                                              {dayNumber}
                                          </Link>
                                          <div className={styles.sport_subsection}>
                                              {(filteredAndGroupedEntries[dateString] || []).map((entry) => {
                                                  // Berechnung der Höhe basierend auf der Dauer
                                                  const height = entry.duration < 20 ? "3px" : `${Math.floor(entry.duration / 20) * 5}px`;
                                                  // Dynamische Klasse basierend auf entry.label
                                                  const entryClass = styles[`${entry.label}_opaque`] || styles.defaultLabel;

                                                  return (
                                                      <div key={entry.entryId} className={`${styles.sport_subsectionLabel} ${entryClass}`} style={{ height }}></div>
                                                  );
                                              })}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  return (
      <div>
          {renderCalendar()}
      </div>
  );
};

export default SummarizedCalendar;