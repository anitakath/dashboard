import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
//STYLES
import styles from './Board.module.css'
//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";
//FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
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
import SearchBar from "../UI/SearchBar";
import ResultsBar from "../UI/ResultsBar";
//HOOK
import {useSearchTerm} from '../../custom-hooks/useSearchTerm'

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

  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredSearchedEntries = useSearchTerm(allSupabaseSports, searchTerm)

    const summarizeAllHandler = (e) => {
      e.preventDefault();
      dispatch(setSelectedSport("all"));
    };

  console.log(currentSport);

  return (
    <div className="w-full overflow-scroll h-full p-4">
      <div className="h-20 flex p-4 flex items-center relative">
        <div className={styles.searchBarResult_div}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {searchTerm != "" && (
            <div className={styles.results_div}>
              <ResultsBar filteredSearchedEntries={filteredSearchedEntries} />
              <button
                className={styles.close_resultsBar_div}
                onClick={() => setSearchTerm("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}
        </div>

        <p className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faHouse} className="font_purple" />
        </p>
        <p className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faBars} className="font_purple" />
        </p>
        <Link href="/profile" className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faUser} className="font_purple" />
        </Link>
        <button className="pointer" onClick={logoutHandler}>
          <Image
            src="/power-off.png"
            alt="Power Off Icon"
            width={37}
            height={37}
            className={styles.logout_btn}
            fetchpriority="eager"
          />
        </button>
        <p
          className="absolute right-14 top-2 h-20 w-20 p-4 "
          style={{ backgroundColor: "var(--purpleDarkHover)" }}
        ></p>
      </div>

      {/*---------------------- MOBILE NAVIGATION ---------------------- */}
      <div className="flex  lg:hidden">
        <Navigation />
      </div>

      <div className="flex justify-center lg:flex-row flex-col  sm:w-full lg:max-h-screen  overflow-y-scroll">
        <div className={styles.entryField}>
          <h1 className="text-2xl border-b-2 my-2"> {currentSport} </h1>

          <p className="mx-10 mt-4 text-xs">
            click on the diary entries to get more details
          </p>

          {currentSport === null && (
            <p className=" my-10 text-2xl text-center">
              select your sport from the navigation bar
            </p>
          )}

          {currentSport != null && (
            <div>
              {currentSport != "all" && (
                <button
                  className={styles.add_entry_btn}
                  onClick={addEntryHandler}
                >
                  <span className={styles.add_btn_icon}> + </span>{" "}
                  {addEntryText}
                </button>
              )}

              <button
                className={styles.plannedSports_btn}
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
                className={styles.summary_allSports_btn}
                onClick={summarizeAllHandler}
              >
                summary of all sports
              </button>
              )}
             

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