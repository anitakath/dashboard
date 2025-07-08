import Link from "next/link";
import { useState, useEffect} from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faChevronLeft, faChevronUp} from "@fortawesome/free-solid-svg-icons";

import styles from "./Details.module.css";
import colors from '../../styles/Colors.module.css'
import { useSelector } from "react-redux";
import useFormatDate from "@/custom-hooks/times_and_dates/useFormatDate";
//COMPONENTS
import PreviousEntries from "./PreviousEntries";

 
//REDUX
import { useDispatch } from "react-redux";
import { setAllPlannedSports } from "@/store/sportReducer";


const DailyDetails = () => {
    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
    const router = useRouter();
    const { id } = router.query;
    const [openHistory, setOpenHistory] = useState(false)
    const [filteredEntries, setFilteredEntries] = useState([]);
    const { formatDateUS, formatDateUK, formatDateDE } = useFormatDate()
    const [currentFormat, setCurrentFormat] = useState('US');
    const [selectedEntry, setSelectedEntry] = useState(null); 
    const [lastFiveYears, setLastFiveYears] = useState([]);
    const [allFilteredPlannedSports, setAllFilteredPlannedSports] = useState([])
    const allPlannedSports = useSelector((state) => state.sport.allPlannedSports)
    const dispatch = useDispatch();




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
  

  const filterPlannedSportsByDate = (dateString) =>{
    const filtered = allPlannedSports.filter(entry=> {
      const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
      return entryDate === dateString;
    })

    setAllFilteredPlannedSports(filtered)


  }


  // Funktion zum Filtern der Einträge für das spezifische Datum
  const filterEntriesByDate = (dateString) => {
      const filtered = allSupabaseSports.filter(entry => {
          const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
          return entryDate === dateString;
      });

      setFilteredEntries(filtered);
  };

  const fetchPlannedSports = async () => {
    try {
      const response = await fetch("/api/get-plannedSports");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      dispatch(setAllPlannedSports(data.data))
     
    } catch (error) {
      console.error("Error fetching planned sports:", error);
    }
  };


  

  useEffect(() => {
    if (id) {
      filterEntriesByDate(id);
      filterPlannedSportsByDate(id)
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

const deletePlannedSport = async (selectedEntry) => {
   // Bestätigungsdialog anzeigen
   const confirmDelete = window.confirm("Do you really want to delete this entry?");
   if (!confirmDelete) {
     return; // Abbrechen, wenn der Benutzer nicht bestätigt
   }

  try {
    // Annahme: selectedEntry hat eine Eigenschaft 'entryId' oder 'id'
    const entryId = selectedEntry.entryId || selectedEntry.id;

    const response = await fetch('/api/plannedSports', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryId }), // sende die ID im Body
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Fehler beim Löschen:', errorData);
      return;
    }
    const result = await response.json();

    if(result){

      // Aktualisiere den lokalen Zustand direkt
     setAllFilteredPlannedSports(prev => prev.filter(entry => (entry.entryId || entry.id) !== entryId));

     // Optional: Wenn du auch den globalen Zustand aktualisieren möchtest:
     dispatch(setAllPlannedSports(prev => prev.filter(entry => (entry.entryId || entry.id) !== entryId)));
 
    fetchPlannedSports();

    setSelectedEntry(null)
    }

   
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error);
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

            <div className="mb-5 w-full md:p-1 my-1 ">
            <h1 className="px-2"> completed sports:</h1>
            {/* Render filtered entries here */}
              {filteredEntries.length >= 0 && filteredEntries.map(entry => (
                <div 
                  key={entry.id} 
                  className={` ${styles.entryBg} ${styles[entry.label]} md:m-2 m-0 my-1 md:my-2 flex-col cursor-pointer`}
                  onClick={() => selectEntryHandler(entry)}
                >
                  <h2 className="m-2 text-xl text-center">{entry.title}</h2>
                </div>
              ))} 

              {filteredEntries.length <= 0 &&  (
                <div>
                  <p className="px-8 py-2"> no sport completed today</p>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="px-2"> planned sports:</h1>
              {allFilteredPlannedSports.length >= 0 && allFilteredPlannedSports.map(entry => (
                <div 
                key={entry.id} 
                className={` ${styles.entryBg} ${colors[entry.label]} md:m-2 m-0 my-1 md:my-2 flex-col cursor-pointer`}
                onClick={() => selectEntryHandler(entry)}
              >
                <h2 className="m-2 text-xl text-center">{entry.title}</h2>
              </div>
              ))}

              {allFilteredPlannedSports.length <= 0 &&  (
                <div>
                  <p className="px-8 py-2"> no sport planned for today</p>
                </div>
              )}
            </div>

            <div className={`mb-10 w-full md:p-4 mx-1  mr-4 max-h-96 overflow-scroll`}>
               {/* Placeholder für den Inhalt des ausgewählten Eintrags */}
                {selectedEntry ? (
                 <div className={`min-h-20 relative  animate-zoom-in max-h-96 overflow-scroll p-3 ${styles[selectedEntry?.label]}`}>
       
                   
                    { selectedEntry && selectedEntry.status === "planned" && (
                      <div className="flex justify-end">
                        <button className="mx-2" onClick={() => deletePlannedSport(selectedEntry) }> delete </button>
                      
                      </div>
                    )}
                   <h3 className="text-xl font-bold mb-2">{selectedEntry.title} </h3>
                    <p className="mx-2 pb-4"> {selectedEntry.entry}</p>
                    <p className="text-sm text-gray-600"><strong>Duration:</strong> {selectedEntry.duration} minutes</p>
                    <p className="text-sm text-gray-600"><strong>Created At:</strong> {new Date(selectedEntry.created_at).toLocaleString()}</p>
                </div>
                ) : (
                  <div className="w-full p-2 flex justify-center items-center animate-zoom-in">
                    <p className="mx-2 pb-4 flex "> Please select an entry to view its content </p> 
                  </div>
                )}
            </div>

          </div>
         
          <div className="my-4 overflow-scroll relative flex-col">
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
              id={id}
            /> 
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDetails;
