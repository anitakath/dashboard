import React from "react";
import styles from "./EditEntry.module.css"; // Importiere die CSS-Moduldatei
import { useSelector, useDispatch} from "react-redux";
import { supabase } from "@/services/supabaseClient";
import useFetchEntries from "@/custom-hooks/entries/useFetchEntries";

export const getAccessToken = async () => {
  const session = await supabase.auth.getSession();
  return session?.data?.session?.access_token;
};


const EditEntry = ({ isModalOpen, currentSport, setCurrentSport, setIsModalOpen }) => {
  // Füge setIsModalOpen als Prop hinzu
  const currentSports = useSelector((state) => state.sport.currentSport);
  const userId = useSelector((state) => state.auth.userId)
  const year = useSelector((state) => state.calendar.year)
  const dispatch = useDispatch();
  const {fetchPlannedSports} = useFetchEntries()

  if (!isModalOpen) return null;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if(name === "name"){
      return
    }

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

  const saveChanges = async (e) => {
    e.preventDefault();
  
  
    if (!currentSport || !currentSport.id) {
      console.error("Kein gültiges Sportobjekt zum Aktualisieren.");
      return;
    }
  
    try {

      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      const response = await fetch("/api/plannedSports", {
        method: "PUT",
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(currentSport),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      fetchPlannedSports(userId, year, dispatch)
      
      setIsModalOpen(false); 
    
    } catch (error) {
      console.error("Fehler beim Speichern:", error.message);
    }
  };
  


  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  };


  const sportProviders = [
    "Urban Sports Club",
    "Wellpass",
    "eGym",
    "Self Paid",
    "Other"
  ];


  return (
    <div className={styles.modal_container} id="editPlannedEntryForm">
      <form className={styles.modal_form}>
        <h2 className={styles.modal_header}>Edit Sport Entry</h2>
        <div className={styles.modal_body}>
          <label className="py-2 ">
            Name:
            <input
              type="text"
              name="name"
              value={currentSport.name}
              onChange={handleInputChange}
              className={styles.modal_input}
            />
          </label>
          <label className="py-2 ">
            Title:
            <input
              type="text"
              name="title"
              value={currentSport.title}
              onChange={handleInputChange}
              className={styles.modal_input}
            />
          </label>
          <label className="py-2 ">
            Entry:
            <textarea
              name="entry"
              value={currentSport.entry}
              onChange={handleInputChange}
              className={styles.modal_textarea}
            />
          </label>

          <div className={styles.radioInputContainer}>
            {sportProviders.map((provider) => (
              <div key={provider} className={`${styles.radioInputDiv}`}>
                <input 
                  type="radio" 
                  id={provider} 
                  name="provider" 
                  value={provider} 
                  onChange={handleInputChange}
                   
                />
                <label htmlFor={provider}>{provider}</label>
              </div>
            ))}
          </div>

          <div className="flex justify-evenly">
            <label className={styles.datesDiv}>
              Duration:
              <input
                type="number"
                name="duration"
                value={currentSport.duration}
                onChange={handleInputChange}
                className={styles.modal_dates_input}
              />
            </label>
            <label className={styles.datesDiv}>
              Date:
              <input
                type="datetime-local"
                name="created_at" 
                value={formatDateForInput(currentSport.created_at)} 
                onChange={(e) => handleInputChange(e)}
                className={styles.modal_dates_input}
              />
            </label>
          </div>
        </div>
        <div className={styles.modal_buttons}>
          <button onClick={saveChanges} className={styles.save_button}>
            Save Changes
          </button>
          <button onClick={()=> setIsModalOpen(false)} className={styles.cancel_button}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditEntry;
