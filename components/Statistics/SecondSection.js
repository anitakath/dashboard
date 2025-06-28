import { useState } from 'react';
import styles from './SecondSection.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
//COMPONENTS
import BarChart from './BarCharts/BarChart';
import useConvertTimes from '@/custom-hooks/times_and_dates/useConvertTimes';
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';
import { useTopSportsByDuration } from '@/custom-hooks/Statistics/useStatistics';


const FirstSection = ({date, setDate}) =>{
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)
  const [showBarChart, setShowBarChart] = useState();

  const { sortedSportsByCount, resultArray } = useStatistics(
    allSupabaseSports,
    date
  );

  const topSportsByDuration = useTopSportsByDuration(allSupabaseSports, date);

  const showBarChartHandler = (item) =>{
    setShowBarChart(item)
  }


    return( 
        <div className={styles.container}>
      
       
        <div className={styles.subContainer}>
          <div className='w-full '>
            <h1 className={styles.title}>
              your favourite sports in {date.year} ...
            </h1> 

            <div className="w-full pr-2">
              <div className='flex'>
                <h1 className='mx-4'> ...referred to number of units.</h1>

                {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
                {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
                {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
                {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
                {/* WHEN BTN CLICKED SHOW BAR CHART WITH EACH SPORT X TIMES COMPLETED IN YEAR Y */}
                <button className={styles.showBarChartButton} onClick={ () => showBarChartHandler("XUNITS")}>  
                  <FontAwesomeIcon icon={faChartLine} />
                </button>

              </div>
        
            {sortedSportsByCount && sortedSportsByCount.length > 0 ? (
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

            <div className="w-full pr-2">

              
              <div className='flex border-transparent'>
                <h1 className={`${styles.spaceDiv} mx-4`}>
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

              <div>
                {topSportsByDuration && topSportsByDuration.map(({ name, totalDurationFormatted, label }, index) => {
                  // Konvertiere totalDurationFormatted (z.B. 5.75) in Minuten
                  const totalDurationInMinutes = Math.round(totalDurationFormatted * 60); // 5.75 Stunden * 60 Minuten
                  const {convertMinutesToHours} = useConvertTimes()
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
       
       
          <div className='w-full'>
            <h1 className={styles.title}>
              any sport in {date.year} ...
            </h1> 
              <h1 className='mx-2'> ...sorted by total hours </h1>
              {resultArray && resultArray.length > 0 ? (
                resultArray
                  .sort((a, b) => b.totalDuration - a.totalDuration)
                  .map(({ name, label, totalDurationFormatted }, index) => {
                  // Konvertiere totalDurationFormatted (z.B. 5.75) in Minuten
                  const totalDurationInMinutes = Math.round(totalDurationFormatted * 60); // 5.75 Stunden * 60 Minuten

                  const {convertMinutesToHours} = useConvertTimes()
                  // Verwende die Funktion zum Konvertieren von Minuten in Stunden und Minuten
                  const formattedDuration = convertMinutesToHours(totalDurationInMinutes);
                  
                  return(
                    <div
                      key={index}
                     /* className={`${styles.totalHours_sports_div} ${styles.linearGradient_bg}`}*/
                      className={`${styles[label]} ${styles.fav_sports_div}`}
                    >
                      <p className="flex items-center">
                        <span className='mr-2'>{name}: </span> {formattedDuration} 
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
        </div>
      </div>


    )
}

export default FirstSection