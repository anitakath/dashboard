import Link from "next/link";
import styles from "./ResultsBar.module.css";

import { getMonth } from "@/custom-hooks/formatDate";

const ResultsBar = ({ filteredSearchedEntries }) => {
  // Check whether there are filtered entries
  if (!filteredSearchedEntries || filteredSearchedEntries.length === 0) {
    return (
      <div className={styles.noResults}>
        <h1>Keine Ergebnisse gefunden</h1>
      </div>
    );
  }



  const test = getMonth(filteredSearchedEntries[0])


 const groupByMonthYear = (entries) => {
   return entries.reduce((acc, entry) => {
     const date = new Date(entry.created_at);
     const monthName = getMonth(entry.created_at); 
     const year = date.getFullYear(); 

     const monthYearKey = `${year}, ${monthName}`; 

     if (!acc[monthYearKey]) {
       acc[monthYearKey] = [];
     }
     acc[monthYearKey].push(entry);
     return acc;
   }, {});
 };
  const groupedEntries = groupByMonthYear(filteredSearchedEntries);

  return (
    <div className={styles.resultsContainer}>
      {Object.entries(groupedEntries).map(([monthYear, entries]) => (
        <div key={monthYear} className=" flex flex-col">
          <h2 className={styles.monthTitle}>{monthYear}</h2>
          {entries.map((entry) => (
            <Link
              href={`/details/${entry.entryPath}`}
              key={entry.id}
              className={styles.resultEntry}
            >
              <h3>
                <strong>{entry.title}</strong>
              </h3>
              <p>{entry.entry}</p>
              <p className={styles.date}>
                {new Date(entry.created_at).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ResultsBar;
