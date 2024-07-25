import React from "react";
import styles from "./EditEntry.module.css"; // Importiere die CSS-Moduldatei

const EditEntry = ({
  isModalOpen,
  currentSport,
  saveChanges,
  handleInputChange,
  setIsModalOpen,
}) => {
  // Füge setIsModalOpen als Prop hinzu
  if (!isModalOpen) return null;

  return (
    <div className={styles.modal_container}>
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
        </div>
        <div className={styles.modal_buttons}>
          <button onClick={saveChanges} className={styles.save_button}>
            Save Changes
          </button>
          <button
           
            className={styles.cancel_button}
          >
            Cancel
          </button>
          {/* Stelle sicher, dass setIsModalOpen übergeben wird */}
        </div>
      </form>
    </div>
  );
};

export default EditEntry;
