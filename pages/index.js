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
//REDUX
import { setAllSportsFromSupabase } from "@/store/sportReducer";



export async function getServerSideProps() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-basiert (0 = Januar)

  // Erster und letzter Tag des aktuellen Monats
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0); // Letzter Tag des Monats

  try {
    const { data, error } = await supabase
      .from("sports")
      .select("*")
      .gte("created_at", startOfMonth.toISOString())
      .lte("created_at", endOfMonth.toISOString())
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }

    return {
      props: {
        sportsData: data || [],
      },
    };
  } catch (error) {
    console.error("Error fetching sports data:", error);
    return {
      notFound: true,
    };
  }
}




export default function Home({ sportsData }) {
  console.log(sportsData);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [sports, setSports] = useState(null);
  const currentSport = useSelector((state) => state.sport.currentSport);

  const addSportsToReduxStore = (arr) => {
    dispatch(setCurrentSport(arr));
  };

  useEffect(() => {
    if (currentSport && currentSport.length > 1) {
      const shortenedArray = [currentSport[0]];
      console.log(shortenedArray);
    }
  }, [currentSport]);

  // Speichere die Sports-Daten im Redux-Store
  useEffect(() => {
    if (sportsData && sportsData.length > 0) {
      // Erstelle ein Array mit den gewünschten Eigenschaften für allSupabaseSports
      const allSportsArray = sportsData.map((obj) => ({
        name: obj.name,
        color: obj.label,
      }));

      dispatch(setAllSportsFromSupabase(allSportsArray)); // Speichere im Redux-Store
    }
  }, [sportsData, dispatch]);


  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)

  console.log(allSupabaseSports)

  /*
  const fetchSportsData = async () => {
    if (currentSport && currentSport.length > 1) {
      console.log("theres already a sportsarr");
      return;
    }
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) {
        throw new Error("Failed to fetch sports data");
      }
      const data = await response.json();

      if (data) {
        // Neues Set erstellen, um eindeutige Kombinationen von name und label zu speichern
        const uniqueSet = new Set();

        // Filtere das Supabase-Array, um nur ein einziges Objekt für jede eindeutige Kombination von name und label zu erhalten
        const uniqueSportsArray = data.data.filter((obj) => {
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
        }));

        setSports(sportsArray);
        addSportsToReduxStore(sportsArray);
      }
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
  };
  
  useEffect(() => {
    fetchSportsData();
  }, []);

  */

  const year = useSelector((state) => state.calendar.year);
  const month = useSelector((state) => state.calendar.month);
  const date = month + " " + year;

  console.log(date);

  return (
    <div className="w-screen h-screen m-0 md:p-10">
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Dashboard />}
    </div>
  );
}
