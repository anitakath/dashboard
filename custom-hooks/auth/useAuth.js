
import { useDispatch } from "react-redux";
import { persistor } from "../../store";
import { setLogin, setLogout, setUserId, setUser } from "../../store/authReducer";
import { setSelectedSport, setAllSportsFromSupabase, setFilteredEntriesByCurrentSport  } from "../../store/sportReducer";
import { supabase } from "../../services/supabaseClient";
import { convertMinutesToHours } from "@/custom-hooks/minutesToHours";
import useFetchEntries from "../entries/useFetchEntries";
import useFilterAndSortEntries from "../entries/useFilterAndSortEntries";
import { months } from "@/custom-hooks/useCalendar"; // Importiere das months-Array

const useAuth = (userId) => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await supabase.auth.signOut();

    dispatch(setLogout(false));
    dispatch(setUserId(null));

    await persistor.purge();
    /*persistor
      .purge()
      .then(() => {
        console.log("Persisted state has been purged");
      })
      .catch((error) => {
        console.error("Error purging persisted state:", error);
      });*/
  };

  const loginHandler = async (loginData, currentSport) => {
    const {
      data: { user },
      error
    } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      //console.log(error.message)
      throw new Error(error.message);
    }
    const session = await fetchUserSession();
    if (session) {
      const userId = session.user.id;
      const { fetchSportsData } = useFetchEntries(userId);
      const { getFilteredEntriesByCurrentSport } = useFilterAndSortEntries();

      const currentDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        restDaysPerMonth: null,
      };

      //FETCHSPORTSDATA FETCHES ALL SUPABASE OBJECTS BY USER ID
      const filteredEntriesByUserId = await fetchSportsData(userId);

      //FILTER AND SORT SPORT ENTRIES BY CURRENTLY SELECTED SPORT
      const filteredEntriesByCurrentSport =
        await getFilteredEntriesByCurrentSport(
          filteredEntriesByUserId,
          currentSport,
          currentDate
        );

      dispatch(setFilteredEntriesByCurrentSport(filteredEntriesByCurrentSport));

      await dispatch(setAllSportsFromSupabase(filteredEntriesByUserId));
      await dispatch(setLogin(true));
      await dispatch(setSelectedSport("all"));
    }

    return user;
  };

  // *******************CLEAN IT UPPPP *******************

  const filterEntriesByCurrentSportAndDate = async (
    filteredEntriesByUserId,
    currentSport,
    currentDate
  ) => {
    const entries = filteredEntriesByUserId.filter(
      (sport) => sport.name === currentSport
    );


    const getMonthNumber = (month) => {
      
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return months.indexOf(month) + 1;
    };

    const filteredResults = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getFullYear() === currentDate.year &&
        entryDate.getMonth() + 1 === getMonthNumber(currentDate.month)
      );
    });
    const totalDurationInMinutes = filteredResults.reduce(
      (total, entry) => total + entry.duration,
      0
    );
    const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);

    // Optional: Hier kannst du die totalDurationInHours speichern oder verwenden
    //console.log(`Total Duration in Hours: ${totalDurationInHours}`);
    //console.log(filteredResults)

    dispatch(setFilteredEntriesByCurrentSport(filteredResults));
  };
  // ******************* CLEANED IT UPPPP ???? *******************

  
  
  const fetchUserSession = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error);
      return null;
    } else if (session) {
      dispatch(setUserId(session.user.id));
      dispatch(setUser(session));

      return session;
    } else {
      console.log("No user is logged in");
      return null;
    }
  };

  const registerHandler = async (registerData) => {
    // Validierung der Eingaben
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      throw new Error("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    }

    if (registerData.name.length < 1 || registerData.name.length > 20) {
      throw new Error("Der Name muss zwischen 1 und 20 Zeichen lang sein.");
    }

    if (registerData.password !== registerData.confirmPassword) {
      throw new Error("Die Passwörter stimmen nicht überein.");
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(registerData.password)) {
      throw new Error(
        "Das Passwort muss mindestens 6 Zeichen lang sein und mindestens einen Großbuchstaben und eine Zahl enthalten."
      );
    }

    // Überprüfen, ob die E-Mail bereits existiert
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("email", registerData.email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error("Fehler beim Überprüfen der E-Mail.");
    }
    if (existingUser) {
      throw new Error("Diese E-Mail-Adresse ist bereits registriert.");
    }

    // Benutzer registrieren
    const { user, error: signUpError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: { data: { name: registerData.name } },
    });

    if (signUpError) {
      throw new Error(signUpError.message);
    }
    // Zusätzliche Benutzerdaten speichern
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        { id: user.id, email: registerData.email, name: registerData.name },
      ]);

    if (insertError) {
      throw new Error(insertError.message);
    }

    console.log("User registered:", user);
    return user; // Benutzer zurückgeben für weitere Verwendung
  };

  const resetPasswordHandler = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }

    console.log("Password reset email sent to:", email);
  };

  const getUserData = () => {
    const user = supabase.auth.user();

    if (!user) {
      throw new Error("No user is logged in");
    }

    return user;
  };

  const updateProfileHandler = async (profileData) => {
    const { error } = await supabase.from("profiles").upsert(profileData);

    if (error) {
      throw new Error(error.message);
    }

    console.log("Profile updated successfully");
  };

  return {
    logoutHandler,
    loginHandler,
    registerHandler,
    resetPasswordHandler,
    getUserData,
    updateProfileHandler,
    // *******************CLEAN IT UPPPP *******************
    filterEntriesByCurrentSportAndDate,
    
  };
};

export default useAuth;

