
import { useDispatch } from "react-redux";
import { persistor } from "@/store";
import { setLogin, setLogout, setUserId, setUser } from "@/store/authReducer";
import { setSelectedSport } from "@/store/sportReducer";
import { supabase } from "@/services/supabaseClient";
import { setAllSportsFromSupabase } from "@/store/sportReducer";

const useAuth = (userId) => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await supabase.auth.signOut();

    dispatch(setLogout(false));
    dispatch(setUserId(null))

    persistor
      .purge()
      .then(() => {
        console.log("Persisted state has been purged");
      })
      .catch((error) => {
        console.error("Error purging persisted state:", error);
      });
  };

  const loginHandler = async (loginData) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("User logged in:", user);
  
    const session = await fetchUserSession();

    if (session) {
       const userId = session.user.id;
       const filteredEntriesByUserId = await fetchSportsData(userId);
       dispatch(setAllSportsFromSupabase(filteredEntriesByUserId));
       dispatch(setLogin(true)); 
       dispatch(setFilteredEntries(filteredEntriesByUserId))
       dispatch(setSelectedSport("statistics"));
    }
   
    return user;
  };
  

const fetchUserSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return null; 
  } else if (session) {
    dispatch(setUserId(session.user.id));
    dispatch(setUser(session));
    console.log(session.user.id);
    return session; 
  } else {
    console.log("No user is logged in");
    return null; 
  }
};

   const fetchSportsData = async (userId) => {
     try {
       const response = await fetch("/api/sports");

       if (!response.ok) {
         throw new Error("Failed to fetch sports data");
       }

       const data = await response.json();

       if (data) {
         const filteredEntriesByUserId = data.data.filter(
           (entry) => entry.userId === userId
         );

       
         //return filtered array
         return filteredEntriesByUserId;

         if (filteredEntriesByUserId.length === 0) {
           dispatch(setShowAlert(true));
         } else {
           dispatch(setShowAlert(false));
         }
       }
     } catch (error) {
       console.error("Error fetching sports data:", error);
     }
     return [];
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
    fetchSportsData,
  };
};

export default useAuth;

