import { useState, useEffect, useRef } from 'react';
import styles from './Annual.module.css'
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';
import { useTopSportsByDuration } from '@/custom-hooks/Statistics/useStatistics';
import useConvertTimes from '@/custom-hooks/times_and_dates/useConvertTimes';
//COMPONENTS
import RestDaysCalendar from './RestDaysCalendar';
import RandomSportImagesGrid from './RandomSportImagesGrid';
import BarChart from './BarChart';
import ColumnChart from './ColumnChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

const Annual = ({ allSupabaseSports, date, setDate}) => {
  const [showBarChart, setShowBarChart] = useState(null)
  //const [isScrolled, setIsScrolled] = useState(false)
  const [showFiveYearHistory, setShowFiveYearHistory] = useState({
    favourites: false,
    totalHours: false,
    restDays: false,
  })
  const videoRef = useRef(null);

  const { sortedSportsByCount, resultArray } = useStatistics(
    allSupabaseSports,
    date
  );
  const { convertMinutesToHours } = useConvertTimes();
  const topSportsByDuration = useTopSportsByDuration(allSupabaseSports, date);

  const showBarChartHandler = (item) =>{
    setShowBarChart(item)

  }

   // Effect for setting the playback speed
   useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 0.5; // Setze die Wiedergabegeschwindigkeit auf 0.75
    }
}, []);



return (
   
    <div className={styles.staticsticsBodyContainer}>

      {/* VIDEO IN staticsticsBodyContainer  */}
      <video ref={videoRef} width="600" controls autoPlay loop muted className={styles.backgroundVideo}>
                <source src="/yoga.mp4" type="video/mp4" />
                Dein Browser unterstützt das Video-Tag nicht.
      </video>




      {/* TOP 3 SPORTS */}
      <div className={styles.container}>
        <h1 className={styles.title}>
          your favourite sports in {date.year} ...
        
        </h1> 
       
        <div className={styles.subContainer}>
        <div className="mx-2 w-full">
          <div className='flex'>
          <h1> ...referred to number of units.</h1>


          {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
          {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
          {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
          {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
          {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
          <button className={styles.showBarChartButton} onClick={ () => showBarChartHandler("XUNITS")}>  
            <FontAwesomeIcon icon={faChartLine} />
          </button>

          </div>
        
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


      {/* BAR CHART MODAL */}
          {showBarChart === "XUNITS" && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                  <button className={styles.close} onClick={ () => showBarChartHandler(null)}>&times;</button>
                  <BarChart 
                      allSupabaseSports={allSupabaseSports} 
                      date={date} 
                      setDate={setDate} 
                      sortedSportsByCount={sortedSportsByCount} 
                      resultArray={resultArray} 
                      showBarChart={showBarChart}
                      setShowBarChart={setShowBarChart}
                  />
              </div>
            </div>
          )}
        </div>

        <div className="mx-2 w-full">

         <div className='flex'>
          <h1>
              ...referred to completed hours
            </h1>
            {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X HOURS COMPLETED IN YEAR Y */}
            {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X HOURS COMPLETED IN YEAR Y */}
            {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X HOURS COMPLETED IN YEAR Y */}
            {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X HOURS COMPLETED IN YEAR Y */}
            {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X HOURS COMPLETED IN YEAR Y */}
            <button className={styles.showBarChartButton} onClick={ () => showBarChartHandler("XHOURS")}>  
              <FontAwesomeIcon icon={faChartLine} />
            </button>
         </div>

            <div className="mb-4 h-60">
              {topSportsByDuration.map(({ name, totalDurationFormatted, label }, index) => {
                // Konvertiere totalDurationFormatted (z.B. 5.75) in Minuten
                const totalDurationInMinutes = Math.round(totalDurationFormatted * 60); // 5.75 Stunden * 60 Minuten

                // Verwende die Funktion zum Konvertieren von Minuten in Stunden und Minuten
                const formattedDuration = convertMinutesToHours(totalDurationInMinutes);

                return (
                  <div key={name} className={`${styles[label]} ${styles.fav_sports_div}`}>
                    <p>{index + 1}. {name}: {formattedDuration}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>




      {/* TOTAL HOURS OF SPORT  */}

      <div className={styles.container}>
        <h1 className={styles.title}>
          total hours in and per sport in {date.year}
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
              <h2> history div </h2> 
           
              <p> - show a table with the last 5 years in the columns and the sports A-Z in the rows. </p>
              <p> - Then show for year X and sport Y the number of hours of sport completed. </p>
              <p> - the last row should contain the total number of hours for year X</p>
            </div>
          )}

          {showFiveYearHistory.totalHours === false && (
            <div className="w-full flex my-4 lg:m-0">
              
              <div className='w-full'>
                <p className='mx-2'> total: </p>
                {resultArray.length > 0 ? (
                  resultArray.map(({ name, label, totalDurationFormatted }, index) => {
                    // Konvertiere totalDurationFormatted (z.B. 5.75) in Minuten
                    const totalDurationInMinutes = Math.round(totalDurationFormatted * 60); // 5.75 Stunden * 60 Minuten

                    // Verwende die Funktion zum Konvertieren von Minuten in Stunden und Minuten
                    const formattedDuration = convertMinutesToHours(totalDurationInMinutes);

                    return(
                      <div
                        key={index}
                        className={`${styles.totalHours_sports_div} ${styles.linearGradient_bg}`}
                      >
                        <p className="flex tems-center">
                          <span
                            className={`${styles[label]} ${
                              styles.centered_span
                            } `}
                          >
                            {name}:
                          </span>
                          {formattedDuration}
                        </p>
                      </div>
                    )
                      
                  }
                  )
                ) : (
                  <div className="text-center flex justify-center items-center h-full">
                    <p className={styles.error_p}>No data available.</p>
                  </div>
                )}
              </div>

              <div className=" w-full h-80 m-0 my-2 mr-2 p-2 overflow-scroll">
                <ColumnChart resultArray={resultArray}/>
              </div>
            </div>
          )}
        </div>
      </div>






      {/* REST DAYS */}
      <div className={styles.container}>
        <h1 className="text-2xl w-full flex justify-center my-4 items-center ">
          Rest days in {date.year} ...
        </h1>
        <RestDaysCalendar allSupabaseSports={allSupabaseSports} date={date} />
      </div>


      <div className="flex flex-col w-full">
            <div className={styles.images_div}>
            your memories in {date.year} ...
              <RandomSportImagesGrid />
            </div>
      </div>
    </div>
  );
};

export default Annual