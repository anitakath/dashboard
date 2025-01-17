import Link from "next/link";
import { useState, useEffect} from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import styles from "./Details.module.css";
import { useSelector } from "react-redux";
import useFormatDate from "@/custom-hooks/times_and_dates/useFormatDate";


  const DailyDetails = () => {
    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
    const router = useRouter();
    const { id } = router.query;
    const [openHistory, setOpenHistory] = useState(false)
    const [filteredEntries, setFilteredEntries] = useState([]);
    const { formatDateUS, formatDateUK, formatDateDE } = useFormatDate()
    const [currentFormat, setCurrentFormat] = useState('US');
    const [selectedEntry, setSelectedEntry] = useState(null); 
    const [lastFiveYears, setLastFiveYears] = useState([])

  const getFormattedDate = (dateString) => {
      switch (currentFormat) {
        case 'UK':
          return formatDateUK(dateString);
        case 'DE':
          return formatDateDE(dateString);
        default:
          return formatDateUS(dateString);
      }
  };

  const formattedDate = getFormattedDate(id);
  


  // Funktion zum Filtern der Einträge für das spezifische Datum
  const filterEntriesByDate = (dateString) => {
      const filtered = allSupabaseSports.filter(entry => {
          const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
          return entryDate === dateString;
      });

      setFilteredEntries(filtered);
  };


  

  /*
  useEffect(()=>{

    if(openHistory){
      console.log('fetching all entries from this day of the last 5 years ...')
      //fetch ALL supabase table entries
      // filter, starting from the date YYYY - MM - DD ( id ), all entries that were made in the 5 previous years on day DD and month MM.
      // example: id => 2025-01-15 ... filter all entries that were made 2024-01-15, 2023-01-15, .... 2020-01-15 and store them  in entriesLastFiveYears
      // entriesLastFiveYears should then look like this:
     // [2024: [{...}, {...}, {...}, ...], 2023:[{...}, {...},..], .... 2020: [{...}, {...},..] ]
    }

  }, [openHistory])*/
  

  

  useEffect(() => {
    if (id) {
      filterEntriesByDate(id);
    }
  }, [id, allSupabaseSports]);


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


  ]


  const getLastFiveYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - (i + 1));
  };



  useEffect(() => {
    setLastFiveYears(getLastFiveYears());
  }, []);


  const filterEntriesByYear = (year) => {
      return fiveYearsExampleData.filter(entry => {
        const entryYear = new Date(entry.created_at).getFullYear();
        return entryYear === year;
      });
  };




  useEffect(() => {
    if (openHistory) {
      const element = document.getElementById('historyDiv');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [openHistory]); 



  return (
    <div className="w-full h-screen m-0 md:p-14">

      <div className="flex w-full border-2 h-full overflow-scroll py-2 m-0 p-0 relative z-20">

        <div className=" absolute right-3 top-3 bg-red-800 w-20 h-20 m-0 z-0 ">
          <p className="text-xs"> future image div </p>
        </div>

        <div className="absolute left-0 top-0 w-20 h-20 ">
          <Link href="/" className="absolute m-2 p-2 cursor-pointer flex-col items-center justify-center">
            <FontAwesomeIcon icon={faArrowLeft} className={styles.fontAwesomeIcon} />
            <span className="text-xs"> back</span>
          </Link>
        </div>

        

        <div className="w-full">
          <div className="flex justify-center ">
          <h1 className="text-xl flex justify-center my-6">
            {formattedDate}
          </h1>
          <button 
            onClick={() => setCurrentFormat(currentFormat === 'US' ? 'UK' : currentFormat === 'UK' ? 'DE' : 'US')} 
            className="mx-2 "
          >
            {currentFormat === 'US' && <span> 🇺🇸 </span>}
            {currentFormat === 'UK' && <span> 🇬🇧 </span>}
            {currentFormat === 'DE' && <span> 🇩🇪 </span>}
            
          </button>
          </div>



          <div className="w-full flex">

            <div className="my-10 w-2/4 p-1 mx-1">
            {/* Render filtered entries here */}
            {filteredEntries.map(entry => (
              <div 
                key={entry.id} 
                className={` ${styles.entryBg} m-2 flex-col cursor-pointer`}
                onClick={() => setSelectedEntry(entry)}
              >
                <h2 className="m-2 text-xl text-center">{entry.title}</h2>
              </div>
            ))}
            </div>

            <div className={`my-10 w-2/4 p-4 mx-1 mr-4 min-h-20 max-h-96 overflow-scroll`}>
               {/* Placeholder für den Inhalt des ausgewählten Eintrags */}
                {selectedEntry ? (
                 <div className={`min-h-20 animate-zoom-in max-h-96 overflow-scroll p-3 ${styles[selectedEntry?.label]}`}>
                   <h3 className="text-xl font-bold mb-2">{selectedEntry.title}</h3>
                    <p className="mx-2 pb-4"> {selectedEntry.entry}</p>
                    <p className="text-sm text-gray-600"><strong>Duration:</strong> {selectedEntry.duration} minutes</p>
                    <p className="text-sm text-gray-600"><strong>Created At:</strong> {new Date(selectedEntry.created_at).toLocaleString()}</p>
                </div>
                ) : (
                  <div className="w-full p-2 min-h-20 flex justify-center items-center animate-zoom-in">
                    <p className="mx-2 pb-4 "> Please select an entry to view its content </p> 
                  </div>
                )}
            </div>

          </div>
         

     

          <div className="my-4 p-2flex-col">
            <div className="flex justify-center items-center"> 
              <h1> Want to know what you were doing on January 15 of the last 5 years? </h1>

              <button className={styles.historyBtn} onClick={() => setOpenHistory(prevState => !prevState)}>
                  Get your 5 year story here
              </button>
            </div>
           

            {openHistory && (
              <div className="flex min-h-20 mx-4  pb-10 items-center justify-evenly" id="historyDiv">
               {Array.isArray(lastFiveYears) && lastFiveYears.map(year => {
                const entriesForYear = filterEntriesByYear(year);
                return (
                  <div key={year} className={styles.year}>
                    <h2>{year}</h2>
                    {entriesForYear.length > 0 ? (
                      entriesForYear.map(entry => (
                        <div key={entry.entryId} className={styles.pastYearsEntry}>
                          <h3>{entry.title}</h3>
                          <p>{entry.entry}</p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.pastYearsEntry}>
                          <p>No entries were made that year.</p> 
                      </div>
                    )}
                  </div>
                );
              })}
            
            </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDetails;
