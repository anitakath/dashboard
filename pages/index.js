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

export default function Home() {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const [sports, setSports] = useState(null)
  const currentSport = useSelector((state) => state.sport.currentSport)

  const addSportsToReduxStore = (arr) => {
    dispatch(setCurrentSport(arr));
  };


useEffect(() => {
  if (currentSport && currentSport.length > 1) {
    const shortenedArray = [currentSport[0]];
    console.log(shortenedArray);
  }
}, [currentSport]);


  const fetchSportsData = async () => {

    if (currentSport && currentSport.length > 1){
      console.log('theres already a sportsarr')
      return
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


  useEffect(()=>{
    fetchSportsData();
  }, [])

  
  return (
    <div className="w-screen h-screen m-0 md:p-10">
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Dashboard />}
    </div>
  );
}
