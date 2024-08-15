import Link from 'next/link';
import { useEffect, useState } from 'react';
//STYLES 
import styles from './Plans.module.css'
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse} from "@fortawesome/free-solid-svg-icons";
//COMPONENTS
import AddSportField from './AddSportField';

import PlansHeader from './PlansHeader';
import EditEntry from "./EditEntry";
import EditEntryField from './EditEntryField';
import PlansEntryField from "./PlansEntryField";
//REDUX 
import { useSelector, useDispatch } from 'react-redux';
import { removeSport, replaceSportsArray } from "@/store/profileReducer";
//CUSTOM HOOKS

import { supabase } from '@/services/supabaseClient';
import { current } from '@reduxjs/toolkit';


const Plans = () =>{
  const [openDetailsIds, setOpenDetailsIds] = useState([]); // Zustand für mehrere geöffnete IDs
  const [areAllOpen, setAreAllOpen] = useState(false);
  const [addSport, setAddSport] = useState(false);
  const currentSports = useSelector((state) => state.sport.currentSport[0]);
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

  let addSportBtnText = addSport ? "close form" : "add a sport";

  const chooseSportHandler = (e) => {
    const currSport = e.currSport;
    setChosenSport(e.currSport);
    setActiveSport(currSport.name);
  };

  const deleteSportHandler = async (sport) => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to delete your workout?")) {
      try {
        // Send DELETE request to the API
        const response = await fetch("/api/plannedSports", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ entryId: sport.entryId }), // Pass the entryId of the sport to be deleted
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Filter the original sportsArray
        const filteredSportsArray = sportsArray.filter(
          (sportObj) => sportObj.entryId !== sport.entryId
        );

        // Update the state with the filtered array
        setSportsArray(filteredSportsArray);

        // Dispatch the removeSport action to the Redux Store
        dispatch(removeSport(sport.entryId));
      } catch (error) {
        console.error("Error deleting sport:", error);
      }
    }
  };

  const checkSportHandler = async (sport) => {
    try {
      // 1. Insert the sports object into the 'sports' table
      const { data: insertData, error: insertError } = await supabase
        .from("sports")
        .insert([
          {
            entryId: sport.entryId,
            name: sport.name,
            title: sport.title,
            entry: sport.entry,
            label: sport.label,
            entryPath: sport.entryPath,
            duration: sport.duration,
            created_at: new Date().toISOString(), // Current date as creation date
          },
        ]);

      if (insertError) {
        console.error("Error inserting data:", insertError);
        return; // Exit the function if an error occurs
      }

      console.log("Data inserted successfully:", insertData);

      // 2. Delete the sports object from the 'sports_planned' table via the API
      const response = await fetch("/api/plannedSports", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId: sport.entryId }), // Pass the entryId of the sport to be deleted
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting planned sport:", errorData.error);
        return; // Exit the function if an error occurs
      }

      const deleteData = await response.json();
      console.log("Planned sport deleted successfully:", deleteData);

      // 3. Update the state and remove the deleted sport object from the array
      const filteredSportsArray = sportsArray.filter(
        (sportObj) => sportObj.entryId !== sport.entryId
      );

      setSportsArray(filteredSportsArray);

      // Dispatch die removeSport Action an den Redux Store
      dispatch(removeSport(sport.entryId));
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const editSportHandler = (sport) => {
    setCurrentSport(sport);
    setIsModalOpen(true);

  };

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

  const saveChanges = async () => {
    if (!currentSport) return; //Check whether currentSport is set

    try {
      // 1. Send the edited sports object to the API for updating
      const response = await fetch("/api/plannedSports", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentSport), // Send the entire current sports object
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating planned sport:", errorData.error);
        return; // Exit the function if an error occurs
      }

      const updateData = await response.json();
      console.log("Planned sport updated successfully:", updateData);

      // 2. replace the object in the local array
      const replaceObjectInArray = (array, currentSport) => {
        return array
          .map((item) => {
            if (item.entryId === currentSport.entryId) {
              return currentSport; // Replace the object with currentSport
            }
            return item; //stay with the original object
          })
          .filter((item) => item !== null); // Filter out any zero values
      };

      setSportsArray((prevArray) =>
        replaceObjectInArray(prevArray, currentSport)
      );
    } catch (error) {
      console.error("An unexpected error occurred:", error);
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

  const [formIsOpen, setFormIsOpen] = useState(false);


   const addSportClickHandler = () => {
     setFormIsOpen((prevState) => !prevState);
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
        {sportsArray === null && !addSport && <p> no entries were made yet</p>}

        <div className="w-full">
          <AddSportField
            addSport={addSport}
            currentSports={currentSports}
            activeSport={activeSport}
            addSportClickHandler={addSportClickHandler}
            formIsOpen={formIsOpen}
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