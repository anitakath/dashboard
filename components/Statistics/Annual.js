import { useState } from 'react';
import styles from './Annual.module.css'
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';
import { useTopSportsByDuration } from '@/custom-hooks/Statistics/useStatistics';
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
  const topSportsByDuration = useTopSportsByDuration(allSupabaseSports, date);


  return (
    <div>
      {/* TOP 3 SPORTS */}

      <div className={styles.container}>
        <h1 className="text-2xl w-full flex  justify-center mb-4 items-center ">
          your favourite sports in {date.year} ...
        </h1>
        <div className="w-full">
          <h1> ... referred to the number of units.</h1>
          {sortedSportsByCount.length > 0 ? (
            sortedSportsByCount.map(([name, { count, label }], index) => (
              <div
                key={name}
                className={`${styles[label]} ${styles.fav_sports_div}`}
              >
                <p>
                  {index + 1}. {name}, {count}x {label}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center flex justify-center items-center h-full">
              <p className={styles.error_p}>
                No entries were created for this period.
              </p>
            </div>
          )}
          <h1>
            {" "}
            ...referred to the number of hours of sport completed in the
            individual units.
          </h1>
          <div className="border-2 mb-4 h-60">
            {topSportsByDuration.map(
              ({ name, totalDurationFormatted, label }, index) => (
                <div
                  key={name}
                  className={`${styles[label]} ${styles.fav_sports_div}`}
                >
                  <p>
                    {index + 1}. {name}: {totalDurationFormatted} 
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* TOTAL HOURS OF SPORT  */}

      <div className={styles.container}>
        <h1 className="text-2xl w-full flex justify-center items-center ">
          Total hours per sport and your memories in {date.year} ...
        </h1>

        <button
          className="absolute m-1 mx-2  border-b-2 top-0 px-2 hover:text-red-200"
          onClick={() =>
            setShowFiveYearHistory((prevState) => ({
              ...prevState,
              totalHours: !prevState.totalHours,
            }))
          }
        >
          5 year history
        </button>
        <div className="flex flex-col lg:flex-row mt-2">
          {showFiveYearHistory.totalHours && (
            <div className={styles.history_div}>
              <p> history div </p>
            </div>
          )}

          {showFiveYearHistory.totalHours === false && (
            <div className="w-full my-4 lg:m-0 ">
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

              <div className="border-t-2 border-b-  h-80 m-0 my-2 mr-2 p-2 overflow-scroll">
                <h1>
                  put a diagram here that shows the number of hours spent on the
                  individual sports in relation to the total hours of a year
                  (8766).
                </h1>
              </div>
            </div>
          )}
          <div className="flex flex-col w-full">
            <div className={styles.images_div}>
              <RandomSportImagesGrid />
            </div>
          </div>
        </div>
      </div>

      {/* REST DAYS */}

      <div className={styles.container}>
        <h1 className="text-2xl w-full flex justify-center my-4 items-center ">
          Rest days in {date.year} ...
        </h1>
        <RestDaysCalendar allSupabaseSports={allSupabaseSports} date={date} />
      </div>
    </div>
  );
};

export default Annual