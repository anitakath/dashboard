// useAuth.js
import { useDispatch } from "react-redux";
import { persistor } from "@/store";
import { setLogin, setLogout } from "@/store/authReducer"; // Passe den Pfad zu deinen Aktionen an
import { supabase } from "@/services/supabaseClient"; // Importiere Supabase

const useAuth = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(setLogout(false));

    // Leere den Persist-Speicher
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
      throw new Error(error.message); // Fehler werfen, um ihn im Login-Formular abzufangen
    } else {
      console.log("User logged in:", user);
      dispatch(setLogin(true));
      return user; // Benutzer zurückgeben, falls benötigt
    }
  };

  return { logoutHandler, loginHandler };
};

export default useAuth;
