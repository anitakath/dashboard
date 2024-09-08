import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
//STYLES
import styles from './Board.module.css'
//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";
//FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import AddEntryForm from "./AddEntryForm";
//REDUX
import { useSelector, useDispatch} from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
import { setSection } from "@/store/profileReducer";
import { setLogout } from "@/store/authReducer";

//COMPONENTS
import Calendar from "./Calendar";
import Entry from "./Entry";
import Navigation from "../Navigation/Navigation";
import SummarizedEntries from "./Daily/SummarizedEntries";

//HOOK
import {useSearchTerm} from '../../custom-hooks/useSearchTerm'
import useAuth from "@/custom-hooks/auth/useAuth";
import BoardHeader from "./BoardHeader/BoardHeader";
import BoarderSubHeader from "./BoardHeader/BoarderSubHeader";


const Board = (props) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const navigation = useSelector((state => state.sport.navigation))
  const filteredEntries = props.filteredEntries;
  const sportsDurationByMonth = props.sportsDurationByMonth;
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const [formIsOpen, setFormIsOpen] = useState(false);
  const actualDate = useSelector((state) => state.calendar);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const actualMonthIndex = monthNames.findIndex(month => month === actualDate.month);
  const actualMonth = actualMonthIndex + 1;
  const filteredByDate = filteredEntries.filter((entry) => {
  const entryDate = new Date(entry.created_at);
  const entryYear = entryDate.getFullYear();
  const entryMonth = entryDate.getMonth() + 1; // Monat von 0-11 zu 1-12 ändern
    return entryYear === actualDate.year && entryMonth === actualMonth;
  });
  const router = useRouter()
  const dispatch = useDispatch();

  //console.log(allSupabaseSports);


  const { logoutHandler } = useAuth();

  useEffect(()=> {
    if(navigation.includes(currentSport)){
    } else{
      dispatch(setSelectedSport(navigation[0]))
    }
  }, [navigation])


    useEffect(() => {
      if (allSupabaseSports.length > 0) {
        // Hier kannst du Logik hinzufügen, die ausgeführt werden soll,
        // wenn allSupabaseSports aktualisiert wird.
        console.log("allSu  pabaseSports wurde aktualisiert:", allSupabaseSports);

        // Optional: Du könntest hier auch eine Funktion aufrufen,
        // um den Zustand oder andere Logik zu aktualisieren.
      }
    }, [allSupabaseSports]);




  const dailyAllHandler = () => {
    dispatch(setSelectedSport("daily"));
  };

  return (
    <div className="w-full overflow-scroll flex flex-col items-center h-full p-2 ">
      <h1 className="title title_mini"> DASHBOARD </h1>

      <BoardHeader logoutHandler={logoutHandler} />

      {/*---------------------- MOBILE NAVIGATION ---------------------- */}
      <div className="flex w-full lg:hidden">
        <Navigation />
      </div>

      <div className="flex justify-center lg:flex-row flex-col w-full lg:max-h-screen  ">
        <div className={styles.entryField}>
          <h2 className="subtitle flex items-center"> {currentSport} </h2>

          {currentSport === null && (
            <p className=" my-10 text-2xl text-center">
              select your sport from the navigation bar
            </p>
          )}


          {currentSport != null && (
            <BoarderSubHeader
              currentSport={currentSport}
              dailyAllHandler={dailyAllHandler}
            />
          )}

          {/* --------------------------  THE ENTRIES -------------------------- */}

          {filteredByDate.length === 0 &&
            currentSport != "all" &&
            currentSport !== "daily" && (
              <p className="m-2 text-xl"> no entries were made </p>
            )}
          {currentSport === "daily" && (
            <SummarizedEntries filteredEntries={filteredEntries} />
          )}
          {currentSport === "all" && (
            <Entry filteredByDate={allSupabaseSports} />
          )}
          {currentSport != "all" && currentSport !== "daily" && (
            <Entry
              filteredEntries={filteredEntries}
              allSupabaseSports={allSupabaseSports}
              sportsDurationByMonth={sportsDurationByMonth}
            />
          )}
        </div>

        {/*  -------------------------- SUMMARY SECTION  -------------------------- */}

        {currentSport != "daily" && (
          <Calendar filteredByDate={filteredByDate} />
        )}
      </div>
    </div>
  );
};

export default Board;