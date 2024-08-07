import Image from "next/image";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/services/supabaseClient";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { setCurrentSport } from "@/store/sportReducer";
import { useRouter } from "next/router";

//COMPONENTS
import Dashboard from "@/components/Dashboard/Dashboard";
import Login from "@/components/Login/Login";
import Register from "@/components/Login/Register";
//REDUX
import { setAllSportsFromSupabase } from "@/store/sportReducer";

export async function ggetServerSideProps() {
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

    const router = useRouter();

    /*IMPLEMENT AUTH!!!!  */
    /*useEffect(() => {
      const checkUserSession = async () => {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
        }
      };

      checkUserSession();
    }, [router]);*/


  //console.log(sportsData); => allSupabaseSports initial state???
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [register, setRegister] = useState(false)
  const currentSport = useSelector((state) => state.sport.currentSport);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const [successMessage, setSuccessMessage] = useState(null);

    const fetchSportsData = async () => {
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

    useEffect(() => {
      dispatch(setAllSportsFromSupabase([])); // Initial empty array
      fetchSportsData();
    }, []);



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
      }));

      addSportsToReduxStore(sportsArray);
    } catch (error) {
      console.error("Fehler beim Verarbeiten der Sportdaten:", error);
    }
  };

  
  
  useEffect(() => {
    processSportsData();
  }, [allSupabaseSports]);


  return (
    <div className="w-screen h-screen m-0 md:p-10">
      {register && (
        <Register
          setSuccessMessage={setSuccessMessage}
          successMessage={successMessage}
          setRegister={setRegister}
          register={register}
        />
      )}
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
