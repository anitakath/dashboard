import React from "react";
import styles from "./EditEntry.module.css"; // Importiere die CSS-Moduldatei
import { useSelector } from "react-redux";


const EditEntry = ({ isModalOpen, currentSport, setCurrentSport, setIsModalOpen }) => {
  // Füge setIsModalOpen als Prop hinzu
  const currentSports = useSelector((state) => state.sport.currentSport);
  if (!isModalOpen) return null;

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
          <label className="py-2">
            Name:
            <input
              type="text"
              name="name"
              value={currentSport.name}
              onChange={handleInputChange}
              className={styles.modal_input}
            />
          </label>
          <label className="py-2">
            Title:
            <input
              type="text"
              name="title"
              value={currentSport.title}
              onChange={handleInputChange}
              className={styles.modal_input}
            />
          </label>
          <label className="py-2">
            Entry:
            <textarea
              name="entry"
              value={currentSport.entry}
              onChange={handleInputChange}
              className={styles.modal_textarea}
            />
          </label>

          <div className="w-full flex  justify-center">
            {sportProviders.map((provider) => (
              <div key={provider} className="mx-2 mb-6">
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
            <label className="py-2">
              Duration:
              <input
                type="number"
                name="duration"
                value={currentSport.duration}
                onChange={handleInputChange}
                className={styles.modal_input}
              />
            </label>
            <label className="py-2 ">
              Date:
              <input
                type="datetime-local"
                name="created_at" 
                value={formatDateForInput(currentSport.created_at)} 
                onChange={(e) => handleInputChange(e)}
                className={styles.modal_input}
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
