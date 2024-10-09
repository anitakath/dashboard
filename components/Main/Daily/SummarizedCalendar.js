import Link from "next/link";
import styles from './SummarizedEntries.module.css'
import Calendar from "../Calendar";

const SummarizedCalendar = (props) =>{

    const currentDate = props.currentDate;
    const filteredAndGroupedEntries = props.filteredAndGroupedEntries;


 const renderCalendar = () => {
   const monthsInYear = [
     { name: "JANUARY", days: 31 },
     { name: "FEBRUARY", days: 29 }, //  Leap years not taken into account for simplicity
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


   return (
     <div className={styles.calendar_div}>
     
      <Calendar />
      
      {monthsInYear.map((month, monthIndex) => (
        <div key={month.name} className={styles.month} id={month.name}>
           <h3 className={styles.title}>{month.name}</h3>
           <div className={styles.days}>
             {[...Array(month.days)].map((_, dayIndex) => {
               const dayNumber = dayIndex + 1;
               const dateString = `${
                 new Date(currentDate.getFullYear(), monthIndex, dayNumber + 1)
                   .toISOString()
                   .split("T")[0]
               }`;

               const isToday =
                 new Date().toISOString().split("T")[0] === dateString;

               return (
                 <div
                   key={dayNumber}
                   className={`${styles.day} ${isToday ? styles.today : ""}`}
                 >
                   <Link
                     className={styles.day_date}
                     href={`/daily-details/${dayNumber}${month.name}`}
                   >
                     {dayNumber}
                   </Link>

                   <div className={styles.sport_subsection}>
                     {(filteredAndGroupedEntries[dateString] || []).map(
                       (entry) => {
                         //  Calculation of the amount based on the duration
                         const height =
                           entry.duration < 20
                             ? "3px"
                             : `${Math.floor(entry.duration / 20) * 5}px`;
                         // Here the class is added dynamically based on entry.label
                         const entryClass =
                           styles[`${entry.label}_opaque`] ||
                           styles.defaultLabel;

                         return (
                           <div
                             key={entry.entryId}
                             className={`${styles.sport_subsectionLabel} ${entryClass}`}
                             style={{ height }} // Dynamische Höhe hier anwenden
                           ></div>
                         );
                       }
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
         </div>
       ))}
     </div>
   );
 };

    return(

        <div>
              {renderCalendar()}
        </div>
    )
}

export default SummarizedCalendar;

