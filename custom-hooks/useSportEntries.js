import { useDispatch } from "react-redux";
import { removeSport, setSportsArrayy } from "@/store/profileReducer";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";
import { setAllSportsFromSupabase } from "@/store/sportReducer";
import useFetchEntries from "./entries/useFetchEntries";

/* DELETE COMPLETED  SPORT */
/*used at DetailsPage.js*/
export const useDeleteCompletedSport = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const deleteSport = async (title, id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deleteCompletedSportEntry', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ title, id, userId }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Eintrags');
      }

      await fetchSportsDatas(dispatch, userId); // Aktualisiere die Sportdaten nach dem Löschen
      return { success: true };
    } catch (err) {
      console.error("Error when deleting the entry:", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
          setLoading(false);
    }
   
  };

  return { deleteSport, loading, error };
};

/* DELETE PLANNED SPORT */
export const useDeleteSport = (sportsArray, setSportsArray, userId) => {
  const dispatch = useDispatch();

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

  return deleteSportHandler;
};




//folgende FUnktion wird nach dem Absenden eines neuen Tagebucheintrags ausgeführt
export const fetchSportsDatas = async (dispatch, userId,  currentSport) => {
  
  try {
    const response = await fetch(`/api/sports?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch sports data");
    }
    const data = await response.json();

     // Extrahiere die Namen aus currentSport
     const currentSportNames = currentSport.map(sport => sport.name);

     // Filtere die Daten basierend auf den aktuellen Sportnamen
     const filteredData = data.data.filter(sport => 
         currentSportNames.includes(sport.name)
     );

     // Nur dispatchen, wenn gefilterte Daten vorhanden sind
     if (filteredData.length > 0) {
         dispatch(setAllSportsFromSupabase(filteredData));
     } else {
         console.log("Keine Übereinstimmungen gefunden. Nichts wird dispatched.");
     }


  } catch (error) {
    console.error("Error fetching sports data:", error);
  }
};




/* ADDENTRYFORM */

export const useSubmitHandler = (currentPath, chosenSport, inputs, userId, currentSport) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(true)


    const validateTitle = (title) => title.length >= 3 && title.length <= 50;
    const validateText = (text) => text.length >= 5 && text.length <= 1000;
    const validateDuration = (duration) => {
      const num = parseFloat(duration);
      return !isNaN(num) && num > 0;
    };
    const validateName = (name) => name.trim() !== "";

    const validateInputs = (inputs) => {
      const errors = {};
      if (!validateTitle(inputs.title))
        errors.title = "The title must be between 3 and 50 characters long.";
      if (!validateText(inputs.text))
        errors.text = "The text must be between 5 and 1000 characters long.";
      if (!validateDuration(inputs.duration))
        errors.duration = "The duration must be a positive number.";
      if (!validateName(inputs.name)) errors.name = "The name cannot be empty.";
      if (inputs.created_at === "")
        errors.createdAt = "The creation date cannot be empty.";
      return errors;
    };

    const formatText = (text) => {
      return text.toLowerCase().replace(/\s+/g, "-");
    };



  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    console.log(e)

    // Input validation
    const validationErrors = validateInputs(inputs);

    // Set error messages based on validation
    if (Object.keys(validationErrors).length > 0) {
      setErrorMessage(Object.values(validationErrors).join(" "));
      setSubmitting(false);
      return;
    }

    setErrorMessage("");

    const formattedTitle = formatText(inputs.title);
    const uniqueID = uuidv4();

    const data =
      currentPath === "/profile"
        ? {
            name: chosenSport?.name,
            label: chosenSport?.color,
            entryId: uniqueID,
            title: inputs.title,
            entry: inputs.text,
            userId: inputs.userId,
            entryPath: `${formattedTitle}-${uniqueID}`,
            duration: inputs.duration,
            created_at: inputs.created_at,
          }
        : {
            name: inputs.name,
            label: inputs.label,
            entryId: uniqueID,
            title: inputs.title,
            entry: inputs.text,
            entryPath: `${formattedTitle}-${uniqueID}`,
            duration: inputs.duration,
            created_at: inputs.created_at,
            userId: inputs.userId,
          };

    if (currentPath === "/profile" && !chosenSport) {
      setErrorMessage("Please choose a sport!");
      setSubmitting(false);
      return;
    }

    try {
    
      const validationResponse = await fetch("/api/formValidation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!validationResponse.ok) {
        const validationResult = await validationResponse.json();
        setErrorMessage(Object.values(validationResult.errors).join(" "));

        setErrorMessage("An error occurred while validating the form.");
        setSubmitting(false);
        return;
      }
      

      let response;


      if (currentPath === "/profile") {
        response = await fetch("/api/send-plannedSports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Error sending the data");
        const result = await response.json();
        dispatch(setSportsArrayy(result.data));
      } else {
        const { data: newSport, error } = await supabase
          .from("sports")
          .insert([data]);
        if (error) throw new Error("Failed to insert data into Supabase table");
        await fetchSportsDatas(dispatch, userId, currentSport);
        setFormIsOpen(false);
      }

      setSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };
    return {
      submitHandler,
      successMessage,
      errorMessage,
      submitting,
      formIsOpen,
    };

};

// ADDENTRYFORM

export const useChangeHandler = (inputs, setInputs, validateTitle, validateText, validateDuration) => (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });

    // Hier kannst du auch die Validierung aufrufen und den Zustand entsprechend setzen
    if (name === "title") {
        if (!validateTitle(value)) {
            console.log("Titel ist ungültig");
        }
    }
    if (name === "text") {
        if (!validateText(value)) {
            console.log("Text ist ungültig");
        }
    }
    if (name === "duration") {
        if (!validateDuration(value)) {
            console.log("Dauer ist ungültig");
        }
    }
};








export const addSportHandler = async (newSport, setSportsArray, dispatch) => {
  try {
    const response = await fetch("/api/plannedSports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSport),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const addedSport = await response.json();

    // Update the sports array with the new sport
    setSportsArray((prevSports) => [...prevSports, addedSport]);

    // Optionally dispatch an action to update Redux store
    dispatch(addSport(addedSport));
  } catch (error) {
    console.error("Error adding sport:", error);
  }
};



export const editSportHandler = async (
  sport,
  updatedValues,
  setSportsArray,
  dispatch
) => {
  try {
    const response = await fetch(`/api/plannedSports/${sport.entryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedValues),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const updatedSport = await response.json();

    // Update the sports array with the edited sport
    setSportsArray((prevSports) =>
      prevSports.map((s) =>
        s.entryId === updatedSport.entryId ? updatedSport : s
      )
    );

    // Optionally dispatch an action to update Redux store
    dispatch(editSport(updatedSport));
  } catch (error) {
    console.error("Error editing sport:", error);
  }
};
