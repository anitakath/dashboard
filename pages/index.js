import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { setCurrentSport } from "@/store/sportReducer";
//COMPONENTS
import Head from "next/head";
import Dashboard from "@/components/Dashboard/Dashboard";
import Login from "@/components/Login/Login";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */
import { setAllSportsFromSupabase } from "@/store/sportReducer";
import { setSelectedSport } from "@/store/sportReducer";

import { setFilteredEntriesByCurrentSportAndDate } from "@/store/sportReducer";
import useFetchEntries from "@/custom-hooks/entries/useFetchEntries";
import { updateDate } from "@/store/CalendarReducer";
import { supabase } from "@/services/supabaseClient";

export default function Home() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [register, setRegister] = useState(false);
  const currentSport = useSelector((state) => state.sport.currentSport);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  
  const userId = useSelector((state)=> state.auth.userId)
  const {fetchSportsData} = useFetchEntries();

  useEffect(() => {
    dispatch(setSelectedSport("all"))
    dispatch(updateDate({ month: "Jan", year:  2025 }));
  }, [])

/*
  if (process.env.NODE_ENV === "production") {
    console.log("Running in PRODUCTION mode");
  } else {
    console.log("Running in DEVELOPMENT mode");
  }*/


    console.log(userId)

 


  useEffect(() => {


    const fetchUser = async () =>{
      const user = await supabase.auth.getUser();
      console.log(user);
  
    }

    const getSession = async () =>{
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        console.log('Authenticated')
      }

    }

    getSession();

    fetchUser();

    if(userId){

        const currentDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        restDaysPerMonth: null,
      };

      const fetchData = async(userId) =>{
        const response = await fetchSportsData(userId, currentSport, currentDate)

        const entries = await response.filter(
          (sport) => sport.name === currentSport
        );

        const filterEntries = await entries.filter((entry) => {
          const entryDate = new Date(entry.created_at);
          return (
            entryDate.getFullYear() === currentDate.year &&
            entryDate.getMonth() + 1 === currentDate.month // Hier direkt currentDate.month verwenden
          );
        });

        dispatch(setFilteredEntriesByCurrentSportAndDate(filterEntries));
        await dispatch(setAllSportsFromSupabase(response));
      }
      fetchData(userId);
    }
  }, [])

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






  return (
    <div className="w-screen h-screen border-8 m-0 md:p-10">
     
      <Head>
        <title>Sports Diary</title>
        <meta name="description" content="Your personal sports diary for tracking your athletic progress and connecting with a community." />
        <meta name="keywords" content="sports diary, fitness, track progress, sports community, training, health, wellness" />
        <meta name="author" content="Anne-Kathrin Wagner" />  {/* or companies name */}
        <meta property="og:title" content="Sports Diary" />
        <meta property="og:description" content="Track your athletic progress and connect with like-minded individuals in our community." />
        <meta property="og:image" content="/path/to/your/image.jpg" /> {/* Add the path to an image here */}
        <meta property="og:url" content="https://your-website.com/" /> {/* Replace with your website's URL */}
        <meta name="mobile-web-app-capable" content="yes"></meta>
      </Head>

      {!isLoggedIn && !register && (
        <Login />
      )}
      {isLoggedIn && <Dashboard />}
    </div>
  );
}
