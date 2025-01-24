

import styles from './Details.module.css'

const PreviousEntries = ({openHistory, viewOldEntry, setViewOldEntry, lastFiveYears}) =>{


    const fiveYearsExampleData = [
        {
          created_at: "2024-01-15T17:15:00+00:00",
          duration: 90,
          entry:" gym session: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
          entryId:"3dc8f3789-2239-4c0w-9ad5-e59mnsd5642f",
          entryPath: "loremIpsum-zhs827329d-242-224-nnxhsm-11",
          icon: null,
          id: 111,
          label: "wenge",
          name: "Gym",
          title:"lorem ipsum at the gym",
          userId: "29517271-304a-4ce5-a60b-881a43e91d84"
        },
        {
          created_at: "2024-01-15T17:15:00+00:00",
          duration: 90,
          entry:" gym session: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
          entryId:"3fv36gzny9-2650-0huw-zzz5-e6dbnz9hunff",
          entryPath: "loremIpsum-zhs827329d-242-224-nnxhsm-11",
          icon: null,
          id: 111,
          label: "wenge",
          name: "Gym",
          title:"lorem ipsum at the gym",
          userId: "29517271-304a-4ce5-a60b-881a43e91d84"
        },
        {
          created_at: "2023-01-15T17:15:00+00:00",
          duration: 120,
          entry:" gym session: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
          entryId:"ju87f3789-2zu9-4c0w-9if5-os89swd5642f",
          entryPath: "loremIpsum-zhs827329d-242-224-nnxhsm-11",
          icon: null,
          id: 112,
          label: "wenge",
          name: "Gym",
          title:"lorem ipsum at the gym - part 2",
          userId: "29517271-304a-4ce5-a60b-881a43e91d84"
        },
        {
          created_at: "2022-01-15T17:15:00+00:00",
          duration: 60,
          entry:" Poledance is such  a lovely sport!.",
          entryId:"3dh4is789-0w28-4zzz-cf65-e59mhsn2837ds",
          entryPath: "loremIpsum-zhs827329d-242-224-nnxhsm-11",
          icon: null,
          id: 111,
          label: "fandango",
          name: "Poledance",
          title:"lorem ipsum at the Poledance Studio",
          userId: "29517271-304a-4ce5-a60b-881a43e91d84"
        },
    ]



  const filterEntriesByYear = (year) => {
    return fiveYearsExampleData.filter(entry => {
      const entryYear = new Date(entry.created_at).getFullYear();
      return entryYear === year;
    });
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