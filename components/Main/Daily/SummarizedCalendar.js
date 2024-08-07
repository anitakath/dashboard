import Link from "next/link";
import styles from './SummarizedEntries.module.css'


const SummarizedCalendar = (props) =>{

    const currentDate = props.currentDate;
    const filteredAndGroupedEntries = props.filteredAndGroupedEntries;



 const renderCalendar = () => {
   const monthsInYear = [
     { name: "JANUARY", days: 31 },
     { name: "FEBRUARY", days: 29 }, // Schaltjahre nicht berücksichtigt für Einfachheit
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

   // Filtere alle Einträge basierend auf dem Suchbegriff
   const filterBySearchTerm = (entries) => {
     if (!searchTerm) return entries; // Wenn kein Suchbegriff eingegeben wurde, gebe alle Einträge zurück.

     return entries.filter((entry) =>
       entry.title.toLowerCase().includes(searchTerm.toLowerCase())
     );
   };

   return (
     <div className={styles.calendar_div}>
       {monthsInYear.map((month, monthIndex) => (
         <div key={month.name} className={styles.month}>
           <h3 className={styles.title}>{month.name}</h3>
           <div className={styles.days}>
             {[...Array(month.days)].map((_, dayIndex) => {
               const dayNumber = dayIndex + 1;
               const dateString = `${
                 new Date(currentDate.getFullYear(), monthIndex, dayNumber + 1)
                   .toISOString()
                   .split("T")[0]
               }`;

               return (
                 <div key={dayNumber} className={styles.day}>
                   <Link
                     className={styles.day_date}
                     href={`/daily-details/${dayNumber}${month.name}`}
                   >
                     {dayNumber}
                   </Link>

                   <div className={styles.sport_subsection}>
                     {(filteredAndGroupedEntries[dateString] || []).map(
                       (entry) => {
                         // Hier wird die Klasse dynamisch basierend auf entry.label hinzugefügt
                         const entryClass =
                           styles[`${entry.label}_opaque`] ||
                           styles.defaultLabel; // Fallback-Klasse falls label nicht existiert
                         return (
                           <div
                             key={entry.entryId}
                             className={`${styles.sport_subsectionLabel} ${entryClass}`}
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

