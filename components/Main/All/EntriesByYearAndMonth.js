import { useState } from 'react';
import Link from 'next/link';
//import styles from './EntriesByYearAndMonth.module.css'
import styles from '../Entry.module.css'
//CUSTOM HOOKS
import { formatDate } from '@/custom-hooks/formatDate';
import { formatDuration } from '@/custom-hooks/formatDate';


const EntriesByYearAndMonth = ({ entriesByYearAndMonth, currentSport }) =>{

   const [openMonths, setOpenMonths] = useState({});
   const toggleMonthEntries = (monthName, year) => {
     // Erstelle einen Schlüssel, der sowohl den Monat als auch das Jahr kombiniert
     const monthYearKey = `${monthName}-${year}`;

     setOpenMonths((prevState) => ({
       ...prevState,
       [monthYearKey]: !prevState[monthYearKey], // Toggle den Zustand für diesen spezifischen Monat und Jahr
     }));
   };


  return (
    <div className=''>
       
      {entriesByYearAndMonth &&
          entriesByYearAndMonth.map((yearEntry) => {
            const year = Object.keys(yearEntry)[0]; 
            const months = yearEntry[year]; 

            return (
              <div key={year}>
                <h2 className={styles.yearHeader}>{year} </h2>
                {months.map((monthEntry) => {
                  const monthName = Object.keys(monthEntry)[0]; 
                  const entries = monthEntry[monthName];
                  const totalDuration = entries.reduce((acc, entry) => acc + entry.duration, 0);
                  

                  return (
                    <div key={monthName}>
                      {currentSport === "all" && (
                        <button
                          className={styles.monthYear_header}
                          onClick={() => toggleMonthEntries(monthName, year)}
                        >
                          <p className={styles.monthYear_header_p}>{monthName}</p>
                          <p className={styles.monthYear_header_span}>(total hours of sport:<span className={styles.totalDuration}> {formatDuration(totalDuration)}</span>)</p>
                        </button>
                      )}
                      {openMonths[`${monthName}-${year}`] &&
                        entries
                          .sort(
                            (a, b) =>
                              Date.parse(b.created_at) -
                              Date.parse(a.created_at)
                          )
                          .map((entry, index) => (
                            <div
                              className={styles.entry}
                              key={index}
                              style={{
                                background: getComputedStyle(
                                  document.documentElement
                                ).getPropertyValue(`--${entry.label}`),
                              }}
                            >
                              <Link href={`/details/${entry.entryPath}`}>
                                <div className={styles.link}>
                                  <p className="my-2 px-2 text-xs absolute right-4">
                                    {formatDate(entry.created_at)}
                                  </p>
                                  <h2 className="text-2xl mb-4 mt-2 px-2">
                                    {entry.title} 
                                  </h2>
                                  <p className="px-2 mb-4">{entry.entry}</p>
                                </div>
                              </Link>
                            </div>
                          ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        
      </div>
    );


}

export default EntriesByYearAndMonth