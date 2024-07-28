
import { useSelector } from "react-redux";
import styles from "./SummarizedEntries.module.css";
//HOOKS
import { formatDate } from "@/custom-hooks/formatDate";

const SummarizedEntries = (props) => {
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );

  // Aktuelles Datum
  const currentDate = new Date();

  // Funktion zum Gruppieren und Sortieren der Einträge
  const groupAndSortEntries = (entries) => {
    const groupedEntries = {};
    entries.forEach((entry) => {
      const createdAtDate = new Date(entry.created_at);
      const dayKey = createdAtDate.toISOString().split("T")[0]; // YYYY-MM-DD Format
      if (!groupedEntries[dayKey]) {
        groupedEntries[dayKey] = [];
      }
      groupedEntries[dayKey].push(entry);
    });
    return groupedEntries;
  };

  // Gefilterte und gruppierte/sortierte Einträge (jetzt ungefiltert)
  const filteredAndGroupedEntries = groupAndSortEntries(allSupabaseSports);

  // Funktion zum Rendern des Kalenders
  const renderCalendar = () => {
    const monthsInYear = [
      { name: "JANUARY", days: 31 },
      { name: "FEBRUARY", days: 28 }, // Schaltjahre nicht berücksichtigt für Einfachheit
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
        {monthsInYear.map((month, monthIndex) => (
          <div key={month.name} className={styles.month}>
            <h3 className={styles.title}>{month.name}</h3>
            <div className={styles.days}>
              {[...Array(month.days)].map((_, dayIndex) => {
                const dayNumber = dayIndex + 1;
                const dateString = `${
                  new Date(currentDate.getFullYear(), monthIndex, dayNumber)
                    .toISOString()
                    .split("T")[0]
                }`;
                return (
                  <div key={dayNumber} className={styles.day}>
                    <span className={styles.day_date}>{dayNumber}</span>
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
                            >
                              {/* Hier kannst du den Inhalt anpassen */}
                            </div>
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

  return (
    <div>
      {renderCalendar()}
      <div>
        {/* Hier kannst du weiterhin die gefilterten und gruppierten Einträge anzeigen */}
        {Object.keys(filteredAndGroupedEntries).map((date) => (
          <div key={date} className=" my-4 p-2 bg-zinc-100">
            <h2>{formatDate(date)}</h2>
            {filteredAndGroupedEntries[date].map((entry) => (
                
              <div key={entry.entryId}>
                <p>
                  {entry.title} - {entry.created_at}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummarizedEntries;

