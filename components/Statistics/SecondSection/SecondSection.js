import styles from '../Annual.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertMinutesToHours } from '@/utils/helpers';

//COMPONENTS
import ColumnChart from './ColumnChart';


const SecondSection = ({date,  setShowFiveYearHistory,  resultArray, showFiveYearHistory, }) =>{


    return(
        
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
    )
}

export default SecondSection