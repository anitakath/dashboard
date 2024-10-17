import Image from "next/image";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/services/supabaseClient";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { setCurrentSport } from "@/store/sportReducer";
//COMPONENTS
import Dashboard from "@/components/Dashboard/Dashboard";
import Login from "@/components/Login/Login";
import Register from "@/components/Login/Register";
 
//CUSTOM HOOKS
import useAuth from "@/custom-hooks/auth/useAuth";
import { fetchSportsData } from "@/custom-hooks/useSportEntries";
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

export default function Home() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [register, setRegister] = useState(false);
  const currentSport = useSelector((state) => state.sport.currentSport);
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const userId = useSelector((state) => state.auth.userId);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    console.log("FETCH DATA");
    fetchSportsData(dispatch, userId);
  }, []);

  const addSportsToReduxStore = (arr) => {
    dispatch(setCurrentSport(arr));
  };

  const processSportsData = () => {
    if (currentSport?.length > 1) {
      console.log("Es gibt bereits ein Sport-Array");
      return;
    }

    try {
      // Neues Set erstellen, um eindeutige Kombinationen von name zu speichern
      const uniqueSet = new Set();

      // Filtere das Supabase-Array, um nur ein einziges Objekt für jede eindeutige Kombination von name zu erhalten
      const uniqueSportsArray = allSupabaseSports.filter((obj) => {
        const key = obj.name;
        if (!uniqueSet.has(key)) {
          uniqueSet.add(key);
          return true;
        }
        return false;
      });

      // Erstelle das neue Array mit den gewünschten Eigenschaften
      const sportsArray = uniqueSportsArray.map((obj) => ({
        name: obj.name,
        color: obj.label,
        icon: obj.icon,
      }));

      addSportsToReduxStore(sportsArray);
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Sportdaten:", error);
    }
  };

  useEffect(() => {
    processSportsData();
  }, [allSupabaseSports, allSupabaseSports]);

  //console.log(currentSport)
  //console.log('test')

  /*   CREATE A BUTTON FOR THIS FUNCTION SO THAT YOU CAN ASSIGN ICONS TO SPORTS THAT DO NOT YET HAVE ONE.
const iconToSupabase = async () => {
  try {
    // Fetch alle Einträge aus der Tabelle "sports"
    const { data: sports, error: fetchError } = await supabase
      .from("sports")
      .select("*");

    if (fetchError) throw fetchError;

    // Filtere die Einträge nach dem Namen "Gym"
    const gymSports = sports.filter((sport) => sport.name === "Spa");

    // Aktualisiere jeden Eintrag mit dem Icon "dumbbell"
    for (const sport of gymSports) {
      const { error: updateError } = await supabase
        .from("sports")
        .update({ icon: "spa" })
        .eq("id", sport.id); // Angenommen, es gibt eine ID-Spalte
      if (updateError) throw updateError;
    }

    console.log("Icons erfolgreich aktualisiert!");
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Icons:", error.message);
  }
};*/

  return (
    <div className="w-screen h-screen m-0 md:p-10">
      {!isLoggedIn &&
        register &&
        {
          /* A register component could be located here */
        }}
      {!isLoggedIn && !register && (
        <Login
          setSuccessMessage={setSuccessMessage}
          successMessage={successMessage}
          setRegister={setRegister}
          register={register}
        />
      )}
      {isLoggedIn && <Dashboard />}
    </div>
  );
}
