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
import BoardHeader from "./BoardHeader/BoardHeader";


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


  const addEntryHandler = (e) => {
    e.preventDefault();
    setFormIsOpen((prevFormIsOpen) => !prevFormIsOpen);
  };

  let addEntryText = formIsOpen ? "close form" : "add entry";



  const logoutHandler = () => {
    dispatch(setLogout(false));
  };

  useEffect(()=> {

       if(navigation.includes(currentSport)){
         //console.log(`${currentSport} exists`)
       } else{
        // console.log(`${currentSport} does not exist`);
         dispatch(setSelectedSport(navigation[0]))
       }


     }, [navigation])


  const navigateToSportPlanHandler = () =>{
    dispatch(setSection("plans"));
    router.push("/profile")
  }

    const summarizeAllHandler = (e) => {
      e.preventDefault();
      dispatch(setSelectedSport("all"));
    };

  return (
    <div className="w-full overflow-scroll h-full p-2 ">
 
      <BoardHeader logoutHandler={logoutHandler} />

      {/*---------------------- MOBILE NAVIGATION ---------------------- */}
      <div className="flex lg:hidden">
        <Navigation />
      </div>

      <div className="flex justify-center lg:flex-row flex-col  sm:w-full lg:max-h-screen  overflow-y-scroll">
        <div className={styles.entryField}>
          <h1 className="text-2xl border-b-2 my-2 "> {currentSport} </h1>

          {currentSport === null && (
            <p className=" my-10 text-2xl text-center">
              select your sport from the navigation bar
            </p>
          )}

          {currentSport != null && (
            <div className="mb-2">
              {currentSport != "all" && (
                <button
                  className={styles.allSports_btn}
                  onClick={addEntryHandler}
                >
                  <span className={styles.add_btn_icon}> + </span>{" "}
                  {addEntryText}
                </button>
              )}

              <button
                className={styles.allSports_btn}
                onClick={navigateToSportPlanHandler}
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  className={styles.calendar_icon}
                />
                planned sports units
              </button>
              {currentSport === "daily" && (
                <button
                  className={styles.allSports_btn}
                  onClick={summarizeAllHandler}
                >
                  summary of all sports
                </button>
              )}

              <Link className={styles.diary_link} href="/diary">
                go to your diary
              </Link>

              <TransitionGroup>
                {formIsOpen && (
                  <CSSTransition
                    classNames={{
                      enter: "slide-enter",
                      enterActive: "slide-enter-active",
                      exit: "slide-exit",
                      exitActive: "slide-exit-active",
                    }}
                    timeout={300}
                  >
                    <AddEntryForm setFormIsOpen={setFormIsOpen} />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>
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