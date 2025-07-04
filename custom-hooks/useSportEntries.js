import { useDispatch, useSelector} from "react-redux";
import { removeSport, setSportsArrayy } from "@/store/profileReducer";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/services/supabaseClient";
import {  setAllSportsFromSupabase } from "@/store/sportReducer";
import useFetchEntries from "./entries/useFetchEntries";
import { useCallback } from "react";
/* you will find here: */
/* submitHandler @ ADDENTRYFORM.JS */
/* deleteCompletedSport @ DETAILSPAGE.JS */


export const getAccessToken = async () => {
  const session = await supabase.auth.getSession();
  return session?.data?.session?.access_token;
};

/*used at: DetailsPage.js*/
export const useDeleteCompletedSport = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const deleteSport = async (title, id) => {
    setLoading(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      const response = await fetch('/api/deleteCompletedSportEntry', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`,},
        body: JSON.stringify({ title, id, userId }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Eintrags');
      }
      /* FETCH SPORTS DATA AFTER DELETED ENTRY:::: */
      await fetchSportsDataAfterEntry(dispatch, userId);
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


/******** DELETE PLANNED SPORT ********/

/*used at Plans.js*/

export const useDeleteSport = () => {
  const dispatch = useDispatch();
  const plannedSports = useSelector((state) => state.sport.allPlannedSports);
  const {fetchPlannedSports} = useFetchEntries()
  const currentYear = useSelector((state) => state.calendar.year)
  const userId = useSelector((state) => state.auth.userId)


  const deleteSportHandler = async (sport) => {
    if (window.confirm("Are you sure you want to delete your workout?")) {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session.access_token;
        const response = await fetch("/api/plannedSports", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ entryId: sport.entryId }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
     
        // Redux-Store aktualisieren
        dispatch(removeSport(sport.entryId));
        await fetchPlannedSports(userId, currentYear, dispatch);

      } catch (error) {
        console.error("Error deleting sport:", error);
      }
    }
  };

  return deleteSportHandler;
};


/*used at Plans.js*/

// /custom-hooks/useSportEntries.js



export const useCheckAndRemoveSport = () => {
  const dispatch = useDispatch();
  const currentYear = useSelector((state) => state.calendar.year)
  const userId = useSelector((state) => state.auth.userId)

  const checkAndRemoveSport = useCallback(async (sport, setIsLoading) => {
    setIsLoading("checkPlannedSport");

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;
      // 1. Sporteintrag als abgeschlossen markieren


      const response = await fetch("/api/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
        body: JSON.stringify(sport),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding sport:", errorData.error);
        return;
      }

      // 2. Geplanten Eintrag löschen
      const deleteRes = await fetch("/api/plannedSports", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
        body: JSON.stringify({ entryId: sport.entryId }),
      });

      if (!deleteRes.ok) {
        console.error("Failed to delete planned sport");
        return;
      }

      // 3. Redux Store aktualisieren
      dispatch(removeSport(sport.entryId));
      const {fetchPlannedSports} = useFetchEntries()
      
      await fetchPlannedSports(userId, currentYear, dispatch);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setIsLoading(null);
    }
  }, [dispatch]);

  return checkAndRemoveSport;
};



/******** REFETCH ENTRIES, WHEN  USER MADE A NEW ONE || DELETED ONE  ********/
/*used at useSportEntries.js in submitHandler further down  and useDeleteCompletedSport further up */
export const fetchSportsDataAfterEntry = async (dispatch, userId,  currentSport) => {
  
  try {
    const year = new Date().getFullYear();
    const response = await fetch(`/api/sports?userId=${userId}&year=${year}`);
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
export const useSubmitHandler = (
  currentPath,
  chosenSport,
  inputs,
  userId,
  currentSport
) => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(true);

  const transformTitle = (title) => {
    const umlautMap = { ä: "ae", ö: "oe", ü: "ue", Ä: "Ae", Ö: "Oe", Ü: "Ue", ß: "ss" };
    title = title
      .replace(/[\/\?&%#=+]/g, "")
      .replace(/[^a-zA-Z0-9äöüÄÖÜß\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();
    for (const [u, r] of Object.entries(umlautMap)) {
      title = title.replace(new RegExp(u, "g"), r);
    }
    return title.toLowerCase();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    const formattedTitle = transformTitle(inputs.title);
    const uniqueID = uuidv4();

    const data =
      currentPath === "/profile"
        ? {
            name: chosenSport?.name,
            label: chosenSport?.color,
            entryId: uniqueID,
            title: inputs.title,
            entry: inputs.text,
            userId,
            entryPath: `${formattedTitle}-${uniqueID}`,
            duration: inputs.duration,
            created_at: inputs.created_at,
            provider: inputs.provider,
            status: "planned",
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
            userId,
            provider: inputs.provider,
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
        const result = await validationResponse.json();
        setErrorMessage(
          Object.values(result.errors || {}).join(" ") ||
            "Validation failed."
        );
        return;
      }

      if (currentPath === "/profile") {
        const response = await fetch("/api/send-plannedSports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error("Failed to send planned entry");
        const result = await response.json();
        dispatch(setSportsArrayy(result.data));

      } else {
        const { error } = await supabase.from("sports").insert([data]);
        if (error) throw new Error("Supabase insert failed");

        /* FETCH SPORTS DATA AFTER SUBMITTED ENTRY:::: */
        await fetchSportsDataAfterEntry(dispatch, userId, currentSport);
        setFormIsOpen(false);
      }

      setSuccessMessage(true);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Unexpected error occurred.");
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
    setFormIsOpen,
  };
};





