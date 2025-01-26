
import styles from '../Annual.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
//COMPONENTS
import BarChart from './BarChart';
//CUSTOM HOOKS
import { convertMinutesToHours } from '@/utils/helpers';


const FirstSection = ({date, sortedSportsByCount, showBarChart, topSportsByDuration, showBarChartHandler, setDate, resultArray, setShowBarChart}) =>{

    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)

    return(
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


    )
}

export default FirstSection