
import { useEffect, useState } from 'react';
import styles from './Details.module.css'

const PreviousEntries = ({id, openHistory, viewOldEntry, setViewOldEntry, lastFiveYears}) =>{

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (id && openHistory) {
      fetchSportsData();
    }
  }, [id, openHistory]);

  const fetchSportsData = async () => {

    try {
      const response = await fetch('/api/getSportsFromLastFiveYears', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, years: lastFiveYears })
      });

      const result = await response.json();
      if (response.ok) {

        const targetMonthDay = new Date(id).toISOString().slice(5, 10); // "07-08"
        const filteredEntries = result.data.filter(entry =>
          entry.created_at.slice(5, 10) === targetMonthDay
        );
  

        console.log(filteredEntries)

        setEntries(filteredEntries);

      } else {
        console.error(result.error);
      }

    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  const filterEntriesByYear = (year) => {
    return entries.filter(entry => new Date(entry.created_at).getFullYear() === year);
  };





    return(

        <div className='w-full h-full'>
             {openHistory && (
              <div className={styles.pastEntriesContainer} id="historyDiv">

                {viewOldEntry != null && (
                 <div className='w-full bg-white z-50'>
                    <div className={`bg-red-200 z-50 p-2  w-full h-full ${styles[viewOldEntry?.label]}`}>
                        <div className="flex justify-end"> 
                        <button onClick={() => setViewOldEntry(null)} className="text-zinc-600 m-2 text-xs"> CLOSE </button>
                        </div>

                        <h1 className="mx-2 text-lg"> {viewOldEntry.title} </h1>
                        <p className="m-2"> {viewOldEntry.entry}  </p>
                        <p> {viewOldEntry.label}</p>

                        <div className="flex">
                        <p className="mx-2"> <strong> created at:</strong> {viewOldEntry.created_at} </p>
                        <p className="mx-2"> <strong> duration: </strong> {viewOldEntry.duration} min</p>

                        </div>
                    </div>
                  </div>
                )}

                {viewOldEntry === null && (
                   Array.isArray(lastFiveYears) && lastFiveYears
                    .sort((a, b) => a - b) // Sortiere die Jahre aufsteigend
                    .map(year => {
                    const entriesForYear = filterEntriesByYear(year);
             
                  return (
                    <div key={year} className={styles.yearDiv}>
                      <h2 className="text-center">{year}</h2>
                      {entriesForYear.length > 0 ? (
                        entriesForYear.map(entry => (
                          <div key={entry.entryId} className={`${styles.pastYearsEntry} ${styles[entry.label]} `}>
                            <button className={styles.titleButton} onClick={() => setViewOldEntry(entry)}>{entry.title}</button>
                
          
                            {/*<p>{entry.entry}</p>*/}
                          </div>
                        ))
                      ) : (
                        <div className={`${styles.pastYearsEntry} opacity-60`}>
                            <p className="opacity-90">No entries were made that year.</p> 
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            )}

        </div>
    )
}

export default PreviousEntries