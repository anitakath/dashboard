import styles from '../SecondSection.module.css'

import { useState } from 'react';
//COMPONENTS
import ColumnChart from './ColumnChart';

const SecondSection = ({date,  resultArray, }) =>{



  const [showFiveYearHistory, setShowFiveYearHistory] = useState({
    favourites: false,
    totalHours: false,
    restDays: false,
  })
    return(
        
      <div className={styles.container}>
      <h1 className={styles.title}>
        total hours in and per sport in {date.year}
      </h1>

    

      <div className="flex border-8 p-0 m-0 flex-col lg:flex-row mt-2">
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
            <div className=" w-full h-80  overflow-scroll">
              <ColumnChart resultArray={resultArray}/>
            </div>
          </div>
        )}
      </div>
    </div>
    )
}

export default SecondSection