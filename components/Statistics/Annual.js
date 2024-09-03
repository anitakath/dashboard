import { useState } from 'react';
import styles from './Annual.module.css'
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';
import { months } from '@/custom-hooks/useCalendar';
//COMPONENTS
import RestDaysCalendar from './RestDaysCalendar';
import RandomSportImagesGrid from './RandomSportImagesGrid';

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
      {/* TOP 3 SPORTS */}

      <div className={styles.container}>
        <h1 className="text-2xl w-full flex justify-center mb-4 items-center ">
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

      {/* TOTAL HOURS OF SPORT  */}

      <div className={styles.container}>
        <h1 className="text-2xl w-full flex justify-center items-center ">
          Total hours per sport ...
        </h1>

        <button
          className="absolute m-2 border-b-2 top-0 px-2 hover:text-red-200"
          onClick={() =>
            setShowFiveYearHistory((prevState) => ({
              ...prevState,
              totalHours: !prevState.totalHours,
            }))
          }
        >
          5 year history
        </button>

        <div className="flex mt-2">
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
                    <div
                      key={index}
                      className={`${styles.totalHours_sports_div} ${styles.linearGradient_bg}`}
                    >
                      <p className=" h-16 flex items-center">
                        <span
                          className={`${styles[label + "_font"]} ${
                            styles.centered_span
                          } `}
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
          <div className={styles.images_div}>  
            <RandomSportImagesGrid/>
          </div>
        </div>
      </div>

      {/* REST DAYS */}

      <div className={styles.container}>
        <h1 className="text-2xl w-full flex justify-center my-4 items-center ">
          Rest days ...
        </h1>

        <RestDaysCalendar allSupabaseSports={allSupabaseSports} date={date} />
      </div>
    </div>
  );
};

export default Annual