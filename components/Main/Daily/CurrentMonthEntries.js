import styles from "./SummarizedEntries.module.css";
import { formatDate } from "@/custom-hooks/formatDate";

const CurrentMonthEntries = (props) => {
  const {
    currentMonthEntries,
    showAllThisYear,
    setShowAllThisYear,
    allThisYearEntries,
  } = props;

  const renderEntries = (entries) => {
    return entries.map((entry) => {
      const createdAtDate = new Date(entry.created_at);
      const timeString = createdAtDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <div key={entry.entryId}>
          <p className="mb-1">
            <span className="font-bold">{entry.title}</span> - {timeString} - (
            {entry.duration} min)
          </p>
        </div>
      );
    });
  };

  const renderDateSection = (date, entries) => (
    <div key={date} className={styles.entries_div}>
      <h2 className={styles.title_days}>{formatDate(date)}</h2>
      {renderEntries(entries)}
    </div>
  );

  return (
    <div className="my-6 ">
      {Object.keys(currentMonthEntries).map((date) =>
        renderDateSection(date, currentMonthEntries[date])
      )}

      <button
        onClick={() => setShowAllThisYear(!showAllThisYear)}
        className={styles.show_more_btn}
      >
        Show all entries this year
      </button>

      {showAllThisYear &&
        Object.keys(allThisYearEntries).map((date) => (
          <div key={date} className="my-4 p-2 bg-zinc-100">
            <h2>{formatDate(date)}</h2>
            {renderEntries(allThisYearEntries[date])}
          </div>
        ))}
    </div>
  );
};

export default CurrentMonthEntries;