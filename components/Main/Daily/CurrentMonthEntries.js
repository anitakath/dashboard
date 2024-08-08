
import styles from './SummarizedEntries.module.css'
import { formatDate } from '@/custom-hooks/formatDate';


const CurrentMonthEntries = (props) =>{

    const currentMonthEntries = props.currentMonthEntries
    const showAllThisYear = props.showAllThisYear
    const setShowAllThisYear = props.setShowAllThisYear;
    const allThisYearEntries = props.allThisYearEntries;


    return (
      <div className="my-6">
        {Object.keys(currentMonthEntries).map((date) => (
          <div key={date} className={styles.entries_div}>
            <h2 className={styles.title_days}>{formatDate(date)}</h2>
            {currentMonthEntries[date].map((entry) => {
              const createdAtDate = new Date(entry.created_at);
              const timeString = createdAtDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={entry.entryId}>
                  <p className="mb-1">
                    <span className="font-bold"> {entry.title} </span>-{" "}
                    {timeString} - ({entry.duration} min)
                  </p>
                </div>
              );
            })}
          </div>
        ))}

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
              {allThisYearEntries[date].map((entry) => {
                const createdAtDate = new Date(entry.created_at);
                const timeString = createdAtDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={entry.entryId}>
                    <p>
                      {entry.title} - {timeString}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    );
}

export default CurrentMonthEntries