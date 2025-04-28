import Link from "next/link";
import styles from "./ResultsBar.module.css";

//import { getMonth } from "@/custom-hooks/times_and_dates/useFormatDate";
import { getMonth } from "@/utils/helpers";
const ResultsBar = ({ filteredSearchedEntries }) => {
  // Check whether there are filtered entries
  if (!filteredSearchedEntries || filteredSearchedEntries.length === 0) {
    return (
      <div className={styles.noResults}>
        <h1>Keine Ergebnisse gefunden</h1>
      </div>
    );
  }

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

  // Sort the grouped entries by year (descending) and month (descending)
  const sortedGroupedEntries = Object.entries(groupedEntries).sort((a, b) => {
    const [yearA, monthA] = a[0].split(", ");
    const [yearB, monthB] = b[0].split(", ");

    // Compare years first (descending)
    if (yearA !== yearB) {
      return yearB - yearA; // Sort descending by year
    }

    // If years are the same, compare months (descending)
    return (
      new Date(Date.parse(monthA + " 1, " + yearA)) -
      new Date(Date.parse(monthB + " 1, " + yearB))
    );
  });


  return (
    <div className={styles.resultsContainer}>
      {sortedGroupedEntries.map(([monthYear, entries]) => (
        <div key={monthYear} className="flex flex-col">
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