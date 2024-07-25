import Link from 'next/link';
import { useEffect, useState } from 'react';
//STYLES 
import styles from './Plans.module.css'
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse} from "@fortawesome/free-solid-svg-icons";
//COMPONENTS
import AddEntryForm from '../../Main/AddEntryForm';
import AddSportForm from '../../Navigation/AddSportForm';
import PlansHeader from './PlansHeader';
import EditEntry from "./EditEntry";
import EditEntryField from './EditEntryField';
import PlansEntryField from "./PlansEntryField";
//REDUX 
import { useSelector, useDispatch } from 'react-redux';
import { removeSport, replaceSportsArray } from "@/store/profileReducer";
//CUSTOM HOOKS
import { formatDate } from '@/custom-hooks/formatDate';
import { supabase } from '@/services/supabaseClient';


const Plans = () =>{
  const [openDetailsIds, setOpenDetailsIds] = useState([]); // Zustand für mehrere geöffnete IDs
  const [areAllOpen, setAreAllOpen] = useState(false);

  const [addSport, setAddSport] = useState(false);
  const currentSports = useSelector((state) => state.sport.currentSport[0]);
  const [chosenSport, setChosenSport] = useState(null);
  const [sportsArray, setSportsArray] = useState(
    useSelector((state) => state.profile.sportsArray)
  ); 
  const [sortedSportsArray, setSortedSportsArray] = useState(
    sportsArray
      ?.slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  );
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSport, setCurrentSport] = useState(null);
  const [activeSport, setActiveSport] = useState(null);


  const addSportHandler = () => {
    setAddSport(!addSport);
  };

  let addSportBtnText = addSport ? "close form" : "add a sport";


  const chooseSportHandler = (e) => {
    const currSport = e.currSport
    setChosenSport(e.currSport);
    setActiveSport(currSport.name)

  };



  const deleteSportHandler = (sport) => {
    // Bestätigungsdialog anzeigen
    if (window.confirm("Are you sure you want to delete your workout?")) {
      // Filtere das ursprüngliche sportsArray
      const filteredSportsArray = sportsArray.filter(
        (sportObj) => sportObj.entryId !== sport.entryId
      );

      // Aktualisiere den Zustand mit dem gefilterten Array
      setSportsArray(filteredSportsArray);

      // Dispatch die removeSport Action an den Redux Store
      dispatch(removeSport(sport.entryId)); // Übergib die entryId des zu löschenden Sports
    }
  };

  const checkSportHandler = async (sport) => {
  
    //insert the sport object to my supabase table "sport"
    const { data, error } = await supabase
        .from('sports') // Name der Tabelle
        .insert([
            {
                entryId: sport.entryId,
                name: sport.name,
                title: sport.title,
                entry: sport.entry,
                label: sport.label,
                entryPath: sport.entryPath,
                duration: sport.duration,
                created_at: sport.created_at,
            },
        ]);

    if (error) {
        console.error("Error inserting data:", error);
    } else {
        console.log("Data inserted successfully:", data);
        const filteredSportsArray = sportsArray.filter(
        (sportObj) => sportObj.entryId !== sport.entryId
      );


      setSportsArray(filteredSportsArray);
      dispatch(removeSport(sport.entryId));
    }
  };

  const editSportHandler = (sport) =>{
    setCurrentSport(sport);
    setIsModalOpen(true);

  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;

   
    setCurrentSport((prev) => {
      // look for an object in currentSports (name & color)whose .name matches the input.name property
      const matchingSport = currentSports.find((sport) => sport.name === value);

      //If there is an object whose name property matches the name of the input, the colour of the object is used as the label property.
      return {
        ...prev,
        [name]: value,
        label: matchingSport ? matchingSport.color : prev.label, 
      };
    });
  };


  const saveChanges = () => {
    if (!currentSport) return; // Überprüfen, ob currentSport gesetzt ist

    // Funktion zum Ersetzen des Objekts in einem Array
    const replaceObjectInArray = (array, currentSport) => {
      return array
        .map((item) => {
          if (item.entryId === currentSport.entryId) {
            return currentSport; // Ersetze das Objekt durch currentSport
          }
          return item; // Behalte das ursprüngliche Objekt bei
        })
        .filter((item) => item !== null); // Filtere eventuell null-Werte heraus
    };

    //updated arrays
    const updatedSortedSportsArray = replaceObjectInArray(
      sortedSportsArray,
      currentSport
    );
    const updatedSportsArray = replaceObjectInArray(sportsArray, currentSport);

   
    //updated arrays set in state
    setSortedSportsArray(updatedSortedSportsArray);
    setSportsArray(updatedSportsArray);

    dispatch(replaceSportsArray(updatedSortedSportsArray));

    // close modal after editing
    setIsModalOpen(false);
  };


  useEffect(()=>{
    setSortedSportsArray(sportsArray)
  }, [sportsArray])

   const enlargeWorkoutHandler = (entryId) => {
     setOpenDetailsIds((prev) =>
       prev.includes(entryId)
         ? prev.filter((id) => id !== entryId)
         : [...prev, entryId]
     );
   };


   const toggleAllEntries = () => {
     if (areAllOpen) {
       setOpenDetailsIds([]);
     } else {
       const allEntryIds = sportsArray.map((sport) => sport.entryId);
       setOpenDetailsIds(allEntryIds); 
     }
     setAreAllOpen(!areAllOpen); 
   };

  return (
    <div className="flex-col justify-center items-center">
      <EditEntry
        isModalOpen={isModalOpen}
        currentSport={currentSport}
        saveChanges={saveChanges}
        handleInputChange={handleInputChange}
      />

      <EditEntryField
      addSportBtnText={addSportBtnText}
      addSportHandler={addSportHandler}
      />

      <div className={styles.form_container}>
        
        {sportsArray === null && !addSport && <p>no entries were made yet</p>}

        <div className="w-full">
          {addSport && (
            <div className="w-full mx-2 flex">
              <div className="flex-col mx-2 w-6/12">
                <h2 className="text-xl my-2 px-2"> choose your sport </h2>
                {currentSports &&
                  currentSports.map((currSport) => (
                    <div
                      key={currSport.name}
                      className={styles.current_sport_div}
                    >
                      <button
                        onClick={() => chooseSportHandler({ currSport })}
                        className={`${styles.sport_buttons} ${
                          styles[currSport.color]
                        } ${
                          activeSport === currSport.name ? styles.active : ""
                        }`}
                      >
                        {currSport.name}
                      </button>
                    </div>
                  ))}
              </div>

              <div className="flex-col mx-2 w-6/12 justify-start ">
                <h2 className="text-xl my-2 px-2">
                  tell us more about your goals :)
                </h2>
                <AddEntryForm chosenSport={chosenSport} />
              </div>
            </div>
          )}
        </div>

        {!addSport && sportsArray != null && (
          <div className={styles.container}>
            <PlansHeader
              toggleAllEntries={toggleAllEntries}
              areAllOpen={areAllOpen}
            />

            <PlansEntryField
              openDetailsIds={openDetailsIds}
              deleteSportHandler={deleteSportHandler}
              checkSportHandler={checkSportHandler}
              editSportHandler={editSportHandler}
              sortedSportsArray={sortedSportsArray}
              enlargeWorkoutHandler={enlargeWorkoutHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Plans