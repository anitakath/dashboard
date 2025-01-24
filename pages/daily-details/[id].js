import Link from "next/link";
import { useState, useEffect} from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faChevronLeft, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./Details.module.css";
import { useSelector } from "react-redux";
import useFormatDate from "@/custom-hooks/times_and_dates/useFormatDate";
//COMPONENTS
import PreviousEntries from "./PreviousEntries";


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

    }, [openHistory])
  */
  

  

  useEffect(() => {
    if (id) {
      filterEntriesByDate(id);
    }
  }, [id, allSupabaseSports]);



  const getLastFiveYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - (i + 1));
  };



  useEffect(() => {
    setLastFiveYears(getLastFiveYears());
  }, []);




  useEffect(() => {
    if (openHistory) {
      const element = document.getElementById('historyDiv');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [openHistory]); 


  const [viewOldEntry, setViewOldEntry] = useState(null)

  const selectEntryHandler = (entry) => {
    if (selectedEntry && selectedEntry.entryId === entry.entryId) {
        setSelectedEntry(null);
    } else {
        setSelectedEntry(entry);
    }
};

  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex w-full border-2 h-full overflow-scroll py-2 m-0 p-0 relative z-20">
        <div className=" absolute right-0 top-0 p-2 w-20 h-20 m-0 z-0 ">
          <p className="text-xs"> {/* FUTURE IMAGE DIV */} </p>
        </div>

        <div className="absolute left-0 top-0 w-20 h-20 ">
          <Link href="/" className="absolute m-2 p-2 cursor-pointer flex-col items-center justify-center">
            <FontAwesomeIcon icon={faArrowLeft} className={styles.fontAwesomeIcon} />
            <span className="text-xs"> back</span>
          </Link>
        </div>

        <div className="w-full">
          <div className="flex justify-center">
          <h1 className=" md:text-xl flex justify-center my-6">
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



          <div className={styles.entryContainer}>

            <div className="mb-5 w-full p-1 mx-1">
            {/* Render filtered entries here */}
            {filteredEntries.map(entry => (
              <div 
                key={entry.id} 
                className={` ${styles.entryBg} ${styles[entry.label]} m-2 flex-col cursor-pointer`}
                onClick={() => selectEntryHandler(entry)}
              >
                <h2 className="m-2 text-xl text-center">{entry.title}</h2>
              </div>
            ))}
            </div>

            <div className={`mb-10 w-full p-4 mx-1 mr-4 max-h-96 overflow-scroll`}>
               {/* Placeholder für den Inhalt des ausgewählten Eintrags */}
                {selectedEntry ? (
                 <div className={`min-h-20 animate-zoom-in max-h-96 overflow-scroll p-3 ${styles[selectedEntry?.label]}`}>
                   <h3 className="text-xl font-bold mb-2">{selectedEntry.title}</h3>
                    <p className="mx-2 pb-4"> {selectedEntry.entry}</p>
                    <p className="text-sm text-gray-600"><strong>Duration:</strong> {selectedEntry.duration} minutes</p>
                    <p className="text-sm text-gray-600"><strong>Created At:</strong> {new Date(selectedEntry.created_at).toLocaleString()}</p>
                </div>
                ) : (
                  <div className="w-full p-2 flex justify-center items-center animate-zoom-in">
                    <p className="mx-2 pb-4 flex "> 
                      <FontAwesomeIcon icon={faChevronLeft} className={`${styles.fontAwesomeIcon} mr-2 mt-1 hidden slg:flex`} />
                      Please select an entry to view its content
                      <FontAwesomeIcon icon={faChevronUp} className={`${styles.fontAwesomeIcon} ml-2 mt-1 slg:hidden`} />
                      
                    </p> 
                  </div>
                )}
            </div>

          </div>
         
          <div className="my-4 p-2 overflow-scroll relative flex-col">
            <div className={styles.pastEntriesTitleContainer}> 
              <h1> Want to know what you were doing on January 15 of the last 5 years? </h1>

              <button className={styles.historyBtn} onClick={() => setOpenHistory(prevState => !prevState)}>
                  Get your 5 year story here
              </button>
            </div>

            <PreviousEntries 
              openHistory={openHistory} 
              viewOldEntry={viewOldEntry} 
              setViewOldEntry={setViewOldEntry} 
              lastFiveYears={lastFiveYears}
            /> 
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDetails;
