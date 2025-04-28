import { use, useEffect, useState } from 'react';
//STYLES 
import styles from './Plans.module.css'
//COMPONENTS
import AddSportField from './AddSportField';
import PlansHeader from './PlansHeader';
import EditEntry from "./EditEntry";
import EditEntryField from './EditEntryField';
import PlansEntryField from "./PlansEntryField";
//REDUX 
import { useSelector, useDispatch } from 'react-redux';
import { removeSport } from "@/store/profileReducer";
//CUSTOM HOOKS
import { useDeleteSport } from '@/custom-hooks/useSportEntries';

const Plans = () =>{
  const [openDetailsIds, setOpenDetailsIds] = useState([]); // Zustand für mehrere geöffnete IDs
  const [areAllOpen, setAreAllOpen] = useState(false);
  const [addSport, setAddSport] = useState(false);
  const currentSports = useSelector((state) => state.sport.currentSport);
  const [chosenSport, setChosenSport] = useState(null);
  const [sportsArray, setSportsArray] = useState([]);
  const [sortedSportsArray, setSortedSportsArray] = useState(
    sportsArray
      ?.slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  );
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSport, setCurrentSport] = useState(null);
  const [activeSport, setActiveSport] = useState(null);
  const [isLoading, setIsLoading] = useState(null)
  const [formIsOpen, setFormIsOpen] = useState(false);
  let addSportBtnText = addSport ? "close form" : "add a sport";
  
 

  useEffect(() => {
    const fetchPlannedSports = async () => {
      try {
        const response = await fetch("/api/get-plannedSports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSportsArray(data.data); // Setze die erhaltenen Objekte in den State
      } catch (error) {
        console.error("Error fetching planned sports:", error);
      }
    };
    fetchPlannedSports();
  }, [addSport]);

  const addSportHandler = () => {
    setAddSport(!addSport);
  };

  const chooseSportHandler = (e) => {
    const currSport = e.currSport;
    setChosenSport(e.currSport);
    setActiveSport(currSport.name);
  };

  /* ------------ DELETE A SPORT HANDLER --------------- */

  const deleteSportHandler = useDeleteSport(sportsArray, setSportsArray);

  const checkSportHandler = async (sport) => {
    setIsLoading("checkPlannedSport")
    try {
      // 1. Insert the sports object into the 'sports' table
      const response = await fetch("/api/sports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId: sport.entryId,
          provider: sport.provider,
          name: sport.name,
          title: sport.title,
          entry: sport.entry,
          label: sport.label,
          userId: sport.userId,
          entryPath: sport.entryPath,
          duration: sport.duration,
          icon: sport.icon,
          created_at: sport.created_at,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding sport:", errorData.error);
        return; // Exit the function if an error occurs
      }

      const data = await response.json();

      setIsLoading(null)

      // 2. Delete the sports object from the 'sports_planned' table via the API
      const deleteResponse = await fetch("/api/plannedSports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId: sport.entryId }), // Pass the entryId of the sport to be deleted
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        console.error("Error deleting planned sport:", errorData.error);
        return; // Exit the function if an error occurs
      }

      const deleteData = await deleteResponse.json();
      console.log("Planned sport deleted successfully:", deleteData);

      // 3. Update the state and remove the deleted sport object from the array
      const filteredSportsArray = sportsArray.filter(
        (sportObj) => sportObj.entryId !== sport.entryId
      );

      setSportsArray(filteredSportsArray);

      dispatch(removeSport(sport.entryId));
     
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };


  const editSportHandler = (sport) => {
    setCurrentSport(sport);
    setIsModalOpen(true);

    const editPlannedEntryForm = document.getElementById("editPlannedEntryForm")

    if (editPlannedEntryForm) {
      editPlannedEntryForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  }; 

  useEffect(() => {
    setSortedSportsArray(sportsArray);
  }, [sportsArray]);

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

  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
  };


  return (
    <div className="flex-col justify-center items-center">
      <EditEntry
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentSport={currentSport}
        setCurrentSport={setCurrentSport}
     
      />

      <EditEntryField
        addSportBtnText={addSportBtnText}
        addSportHandler={addSportHandler}
      />

      <div className={styles.form_container}>
        {sportsArray === null && !addSport && <p> no entries were made yet</p>}

        <div className="w-full">
          <AddSportField
            addSport={addSport}
            currentSports={currentSports}
            activeSport={activeSport}
            addSportClickHandler={addSportClickHandler}
            formIsOpen={formIsOpen}
            setFormIsOpen={setFormIsOpen}
            chosenSport={chosenSport}
            chooseSportHandler={chooseSportHandler}
       
          />
        </div>

        {!addSport && sportsArray != null && (
          <div className={styles.container}>
            <PlansHeader
              toggleAllEntries={toggleAllEntries}
              areAllOpen={areAllOpen}
            />

            <PlansEntryField
              openDetailsIds={openDetailsIds}
              checkSportHandler={checkSportHandler}
              editSportHandler={editSportHandler}
              deleteSportHandler={deleteSportHandler}
              sortedSportsArray={sortedSportsArray}
              enlargeWorkoutHandler={enlargeWorkoutHandler}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Plans