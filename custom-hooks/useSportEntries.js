import { useDispatch } from "react-redux";
import { removeSport, setSportsArrayy } from "@/store/profileReducer";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";
import { setAllSportsFromSupabase } from "@/store/sportReducer";


/* DELETE COMPLETED  SPORT */

export const useDeleteCompletedSport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteSport = async (title, id) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("sports")
        .delete()
        .eq("title", title)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      console.log("Eintrag erfolgreich gelöscht", data);
      return { success: true };
    } catch (err) {
      console.error("Fehler beim Löschen des Eintrags:", err.message);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { deleteSport, loading, error };
};

/* DELETE PLANNED SPORT */
export const useDeleteSport = (sportsArray, setSportsArray) => {
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






const fetchSportsData = async (dispatch) => {
   try {
     const response = await fetch("/api/sports");
     if (!response.ok) {
       throw new Error("Failed to fetch sports data");
     }
     const data = await response.json();
     dispatch(setAllSportsFromSupabase(data.data));
   } catch (error) {
     console.error("Error fetching sports data:", error);
   }
};






export const useSubmitHandler = (currentPath, chosenSport, inputs) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(false);
  const [durationErrorMessage, setDurationErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateTitle = (title) => {
    return title.length >= 3 && title.length <= 50;
  };

  const validateText = (text) => {
    return text.length >= 5 && text.length <= 1000;
  };

  const validateDuration = (duration) => {
    const num = parseFloat(duration);
    if (isNaN(num) || num <= 0) {
      return false; // Wenn duration keine positive Zahl ist
    }
    return true; // Wenn duration eine positive Zahl ist
  };
  const formatText = (text) => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (currentPath === "/profile") {
      if (
        validateTitle(inputs.title) &&
        validateText(inputs.text) &&
        validateDuration(inputs.duration) &&
        inputs.created_at !== ""
      ) {
        setDurationErrorMessage(false);
        const formattedTitle = formatText(inputs.title);
        const uniqueID = uuidv4();

        if (chosenSport === null) {
          setErrorMessage("choose a sport!");
          return;
        }

        const data = {
          name: chosenSport.name,
          label: chosenSport.color,
          entryId: uniqueID,
          title: inputs.title,
          entry: inputs.text,
          entryPath: `${formattedTitle}-${uniqueID}`,
          duration: inputs.duration,
          created_at: inputs.created_at,
        };

        try {
          const response = await fetch("/api/send-plannedSports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error("Fehler beim Senden der Daten");
          }

          const result = await response.json();
          dispatch(setSportsArrayy(result.data));
          setSuccessMessage(true);
        } catch (error) {
          console.error("Fehler:", error);
        }
      } else {
        if (inputs.created_at === "") {
          setDurationErrorMessage(true);
        }
      }
    } else {
      if (
        validateTitle(inputs.title) &&
        validateText(inputs.text) &&
        validateDuration(inputs.duration) &&
        inputs.created_at !== ""
      ) {
        const formattedTitle = formatText(inputs.title);
        const uniqueID = uuidv4();

        const data = {
          name: inputs.name,
          label: inputs.label,
          entryId: uniqueID,
          title: inputs.title,
          entry: inputs.text,
          entryPath: `${formattedTitle}-${uniqueID}`,
          duration: inputs.duration,
          created_at: inputs.created_at,
        };

        try {
          const { data: newSport, error } = await supabase
            .from("sports")
            .insert([data]);

          if (error) {
            console.error("Failed to insert data into Supabase table:", error);
          } else {
            console.log(
              "Data successfully inserted into Supabase table:",
              newSport
            );

            // Rufe fetchSportsData auf und übergebe dispatch
            await fetchSportsData(dispatch);
          
            setSuccessMessage(true);
            setTimeout(() => {
              setSuccessMessage(false);
            }, 5000);
            // Schließe das Formular oder führe andere Aktionen aus
          }
        } catch (error) {
          console.error("Error inserting data into Supabase table:", error);
        }
      } else {
        console.log("Validation failed. Please check your input.");
      }
    }
  };

  return { submitHandler, successMessage, durationErrorMessage, errorMessage };
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