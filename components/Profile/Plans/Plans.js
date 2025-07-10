import { useMemo, useCallback, useState } from 'react';
//STYLES 
import styles from './Plans.module.css'
//COMPONENTS
import AddSportField from './AddSportField';
import PlansHeader from './PlansHeader';
import EditEntry from "./EditEntry";
import EditEntryField from './EditEntryField';
import PlansEntryField from "./PlansEntryField";
//REDUX 
import { useSelector} from 'react-redux';
//CUSTOM HOOKS
import { useDeleteSport } from '@/custom-hooks/useSportEntries';
import { useCheckAndRemoveSport } from '@/custom-hooks/useSportEntries'; 

const Plans = () => {
  const plannedSports = useSelector((state) => state.sport.allPlannedSports);
  const currentSports = useSelector((state) => state.sport.currentSport);
  const [openDetailsIds, setOpenDetailsIds] = useState([]);
  const [areAllOpen, setAreAllOpen] = useState(false);
  const [addSportVisible, setAddSportVisible] = useState(false);
  const [chosenSport, setChosenSport] = useState(null);
  const [activeSport, setActiveSport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSport, setCurrentSport] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const checkAndRemoveSport = useCheckAndRemoveSport()
  const deleteSportHandler = useDeleteSport();

  
  const sortedSportsArray = useMemo(() => {
    return plannedSports
      ?.slice()
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }, [plannedSports]);

  const toggleAddSport = useCallback(() => {
    setAddSportVisible(prev => !prev);
  }, []);

  const chooseSportHandler = useCallback((e) => {
    const currSport = e.currSport;
    setChosenSport(currSport);
    setActiveSport(currSport.name);
  }, []);

  const checkSportHandler = useCallback((sport) => {
    checkAndRemoveSport(sport, setIsLoading);
  }, [checkAndRemoveSport]);



  const editSportHandler = useCallback((sport) => {
    setCurrentSport(sport);
    setIsModalOpen(true);
    document.getElementById("editPlannedEntryForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const enlargeWorkoutHandler = useCallback((entryId) => {
    setOpenDetailsIds((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  }, []);

  const toggleAllEntries = useCallback(() => {
    if (areAllOpen) {
      setOpenDetailsIds([]);
    } else {
      const allEntryIds = plannedSports.map((sport) => sport.entryId);
      setOpenDetailsIds(allEntryIds);
    }
    setAreAllOpen(!areAllOpen);
  }, [areAllOpen, plannedSports]);

  const toggleFormVisibility = useCallback(() => {
    setFormIsOpen(prev => !prev);
  }, []);

  return (
    <div className="flex-col justify-center items-center">
      <EditEntry
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentSport={currentSport}
        setCurrentSport={setCurrentSport}
      />

      <EditEntryField
        addSportBtnText={addSportVisible ? "close form" : "add a sport"}
        addSportHandler={toggleAddSport}
        
      />

      <div className={styles.form_container}>
        {plannedSports.length === 0 && !addSportVisible && (
          <p>no entries were made yet</p>
        )}

        <div className="w-full">
          <AddSportField
            addSport={addSportVisible}
            currentSports={currentSports}
            activeSport={activeSport}
            addSportClickHandler={toggleFormVisibility}
            formIsOpen={formIsOpen}
            setFormIsOpen={setFormIsOpen}
            chosenSport={chosenSport}
            chooseSportHandler={chooseSportHandler}
          />
        </div>

        {!addSportVisible && plannedSports.length > 0 && (
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
              formIsOpen={formIsOpen}
              setFormIsOpen={setFormIsOpen}
              addSportClickHandler={toggleFormVisibility}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;


/*
const Plans = () => {
  const [openDetailsIds, setOpenDetailsIds] = useState([]);
  const [areAllOpen, setAreAllOpen] = useState(false);
  const [addSport, setAddSport] = useState(false);
  const [chosenSport, setChosenSport] = useState(null);

  const plannedSports = useSelector((state) => state.sport.allPlannedSports);
  const sortedSportsArray = plannedSports
    ?.slice()
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSport, setCurrentSport] = useState(null);
  const [activeSport, setActiveSport] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const dispatch = useDispatch();

  const currentSports = useSelector((state) => state.sport.currentSport);
  let addSportBtnText = addSport ? "close form" : "add a sport";

  const addSportHandler = () => {
    setAddSport(!addSport);
  };

  const chooseSportHandler = (e) => {
    const currSport = e.currSport;
    setChosenSport(currSport);
    setActiveSport(currSport.name);
  };


  const deleteSportHandler = useDeleteSport(plannedSports);

  const checkSportHandler = async (sport) => {
    setIsLoading("checkPlannedSport");
    try {
      const response = await fetch("/api/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sport),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding sport:", errorData.error);
        return;
      }

      await fetch("/api/plannedSports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: sport.entryId }),
      });

      dispatch(removeSport(sport.entryId));
      setIsLoading(null);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const editSportHandler = (sport) => {
    setCurrentSport(sport);
    setIsModalOpen(true);
    const form = document.getElementById("editPlannedEntryForm");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      const allEntryIds = plannedSports.map((sport) => sport.entryId);
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
        {plannedSports.length === 0 && !addSport && <p>no entries were made yet</p>}

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

        {!addSport && plannedSports.length > 0 && (
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
};

export default Plans;


*/