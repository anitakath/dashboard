import { useState } from 'react';
import styles from './Annual.module.css'
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';


const Annual = ({ allSupabaseSports, date}) => {

  const [showFiveYearHistory, setShowFiveYearHistory] = useState({
    favourites: false,
    totalHours: false,
    restDays: false,
  })

  const { sortedSportsByCount, resultArray } = useStatistics(
    allSupabaseSports,
    date
  );

  return (
    <div>
      <div className="flex my-4">
        <h1 className="text-2xl w-full flex justify-center items-center ">
          your favourite sports
        </h1>
        <div className="w-full">
          {sortedSportsByCount.length > 0 ? (
            sortedSportsByCount.map(([name, { count, label }], index) => (
              <div
                key={name}
                className={`${styles[label]} ${styles.fav_sports_div}`}
              >
                {index + 1}. {name}, {count}x {label}
              </div>
            ))
          ) : (
            <div className="text-center flex justify-center items-center h-full">
              <p className={styles.error_p}>
                No entries were created for this period.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t-2  my-4 relative flex my-2 overflow-scroll">
        <h1 className="text-2xl w-full flex justify-center items-center">
          Total hours per sport ...
        </h1>

        <button
          className="absolute m-2 border-b-2 px-2 hover:text-red-200"
          onClick={() =>
            setShowFiveYearHistory((prevState) => ({
              ...prevState,
              totalHours: !prevState.totalHours,
            }))
          }
        >
          5 year history
        </button>

        {showFiveYearHistory.totalHours && (
          <div className={styles.history_div}>
            <p> history div </p>
          </div>
        )}

        {showFiveYearHistory.totalHours === false && (
          <div className="w-full ">
            {resultArray.length > 0 ? (
              resultArray.map(
                ({ name, label, totalDurationFormatted }, index) => (
                  <div key={index} className="p-0">
                    <p className=" h-16  flex items-center ">
                      <span
                      
                        className={`${styles[label + "_font"]} ${styles.centered_span} `}
                      >
                        {name}:
                      </span>
                      {totalDurationFormatted}
                    </p>
                  </div>
                )
              )
            ) : (
              <div className="text-center flex justify-center items-center h-full">
                <p className={styles.error_p}>No data available.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-8 my-4 flex ">
        <h1 className="text-center w-full">Rest days ... </h1>
        <div className="h-20 bg-red-200 w-full">
          Show the total number of hours rest days ... active (sauna) passive
          (no entries)
        </div>
      </div>
    </div>
  );
};

export default Annual