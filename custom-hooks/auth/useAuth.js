import { useDispatch } from "react-redux";
import { persistor } from "../../store";
import { setLogin, setLogout, setUserId, setUser } from "../../store/authReducer";
import { setSelectedSport, setAllSportsFromSupabase, setFilteredEntriesByCurrentSportAndDate  } from "../../store/sportReducer";
import { supabase } from "../../services/supabaseClient";
import useFetchEntries from "../entries/useFetchEntries";
/*import useCalendar from "@/custom-hooks/times_and_dates/useCalendar";*/

const useAuth = (userId) => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await supabase.auth.signOut();
    dispatch(setLogout(false));
    dispatch(setUserId(null));
    await persistor.purge();
  };

  const loginHandler = async (loginData, currentSport) => {

    const {
      data: { session, user },
      error
    } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      throw new Error(error.message);
      console.log(error)
    }



    //const session = await fetchUserSession();
    if (session) {
      const userId = session.user.id;
      await dispatch(setUserId(session.user.id));
      await dispatch(setUser(session));
    }


    if (session) {
      const userId = session.user.id;
      // fetch sports data from user in current year only
      const { fetchSportsData } = useFetchEntries(userId);
   
      const currentDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        restDaysPerMonth: null,
      };

      
      // FETCHSPORTSDATA FETCHES ALL SUPABASE OBJECTS BY USER ID IN CURRNT YEAR
      const filteredEntriesByUserId = await fetchSportsData(userId, currentSport, currentDate);


      //FILTER AND SORT SPORT ENTRIES BY CURRENTLY SELECTED SPORT
      const filteredEntriesByCurrentSport =
        await getFilteredEntriesByCurrentSportAndDate(
          filteredEntriesByUserId,
          currentSport,
          currentDate
      );

      console.log(filteredEntriesByCurrentSport)

 

      // SET FILTERED ENTRIES TO REDUX STORE (AFTER LOGIN ALL ENTRIES OF CURRENT YEAR)
      await dispatch(setFilteredEntriesByCurrentSportAndDate(filteredEntriesByCurrentSport));
      await dispatch(setAllSportsFromSupabase(filteredEntriesByUserId));
      await dispatch(setLogin(true));
      await dispatch(setSelectedSport(currentSport))
    
    }
    return user;
  };







  const getFilteredEntriesByCurrentSportAndDate = async (
    filteredEntriesByUserId,
    currentSport,
    currentDate
    ) => {


    const entries = filteredEntriesByUserId.filter(
      (sport) => sport.name === currentSport
    );

    const filterEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getFullYear() === currentDate.year &&
        entryDate.getMonth() + 1 === currentDate.month // Hier direkt currentDate.month verwenden
      );
    });

    console.log(filterEntries)

    return filterEntries;
  };




  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/
  /******************************************************************/  


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

    // Überprüfen, ob der Benutzer bereits existiert
    const { data: existingUser, error: fetchError } = await supabase
        .from('users') // Ersetze 'users' durch den tatsächlichen Tabellennamen in deiner Supabase-Datenbank
        .select('*')
        .eq('email', registerData.email)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 === no user was found
        throw new Error("Fehler beim Überprüfen des Benutzers: " + fetchError.message);
    } else if (existingUser) {
      throw new Error("Ein Benutzer mit dieser E-Mail-Adresse ist bereits registriert.");
    }  else if (fetchError && fetchError.code === 'PGRST116') { 
        //"Kein User gefunden"
        console.log('NO USER WAS FOUND')

        // Benutzer registrieren
        console.log("signing user up...")
        const { user, error: signUpError } = await supabase.auth.signUp({
          email: registerData.email,
          password: registerData.password,
        });

        console.log(registerData)

        if (signUpError) {
          console.log('SIGNUP ERROR')
          console.log(signUpError)
          throw new Error("Fehler bei der Registrierung: " + signUpError.message);
        } else{
          console.log(user)
          console.log(registerData)
        }

        // Optional: Hier kannst du zusätzliche Informationen zum Benutzer in deiner Datenbank speichern
        const { error: insertError } = await supabase
        .from('users') // Ersetze 'users' durch den tatsächlichen Tabellennamen in deiner Supabase-Datenbank
        .insert([{ /*id: registerData.id,*/ name: registerData.name, email: registerData.email }]);

      if (insertError) {
        throw new Error("Fehler beim Speichern der Benutzerdaten: " + insertError.message);
      }
    }


    console.log(registerData); // Optionales Logging

    return user; 
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
  };
};

export default useAuth;

