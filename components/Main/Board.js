import { useEffect, useState } from "react";
//STYLES
import styles from './Board.module.css'
//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";
//REDUX
import { useSelector, useDispatch} from "react-redux";
import { setAllPlannedSports, setSelectedSport } from "@/store/sportReducer";
//COMPONENTS
import BoardHeader from "./BoardHeader/BoardHeader";
import BoarderSubHeader from "./BoardHeader/BoarderSubHeader";
import HowToUseThisApp from "./HowToUseThisApp.js/HowToUseThisApp";
import Calendar from "./Calendar";
import Entry from "./Entry";
import Navigation from "../Navigation/Navigation";
import SummarizedEntries from "./Daily/SummarizedEntries";
//CUSTOM HOOKS
import useCalendar from "@/custom-hooks/times_and_dates/useCalendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import UserImage from "../UI/UserImage";


const Board = () => {
  const filteredEntries = useSelector((state) => state.sport.filteredEntriesByCurrentSportAndDate);
  const currentDate = useSelector((state) => state.calendar);
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const navigation = useSelector((state) => state.sport.navigation);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const { months } = useCalendar();
  const actualMonthIndex = months.findIndex((month) => month === currentDate.month);
  const actualMonth = actualMonthIndex + 1;
  const dispatch = useDispatch();
  const [filteredByDate, setFilteredByDate ] = useState([])
  const [openMenu, setOpenMenu] = useState(false)


  useEffect(() => {
    if (navigation.includes(selectedSport)) {
    } else {
      dispatch(setSelectedSport(navigation[0]));
    }
  }, []);


  useEffect(() => {
    const fetchPlannedSports = async () => {
      try {
        const response = await fetch("/api/get-plannedSports");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        dispatch(setAllPlannedSports(data.data))
        //setSportsArray(data.data); // Setze die erhaltenen Objekte in den State
      } catch (error) {
        console.error("Error fetching planned sports:", error);
      }
    };
    fetchPlannedSports();
  }, [selectedSport]);


  return (
    <div className="w-full relative overflow-scroll flex flex-col items-center h-full p-2 ">

      <button className={styles.goUp_btn}> 
        <FontAwesomeIcon icon={faChevronUp} />
      </button>

      <h1 className="title title_mini"> DASHBOARD </h1>

      <div className={styles.userImageDiv}>
        <UserImage />
      </div>
  

      <BoardHeader openMenu={openMenu} setOpenMenu={setOpenMenu} />

      {/*---------------------- MOBILE NAVIGATION ---------------------- */}
      <div className="flex w-full lg:hidden">
        <Navigation />
      </div>

      <div className="flex justify-center lg:flex-row flex-col w-full lg:max-h-screen  ">
        <div className={styles.entryField}>
          {selectedSport != "start" && (
            <h2 className={`flex mt-4 items-center text-center ${styles.title}`}>
              {selectedSport !== "daily" &&
                selectedSport !== "all" &&
                selectedSport}
            </h2>
          )}

          {selectedSport === "start" && <HowToUseThisApp />}

          {selectedSport === null && (
            <p className=" my-10 text-2xl text-center">
              select your sport from the navigation bar
            </p>
          )}

          {selectedSport != null && selectedSport != "start" && (
            <BoarderSubHeader 
              currentSport={selectedSport}
              openMenu={openMenu} 
              setOpenMenu={setOpenMenu} 
            />
          )}

          {/* --------------------------  THE ENTRIES -------------------------- */}

       
          {selectedSport === "daily" && selectedSport != "start" && (
            <SummarizedEntries filteredEntries={filteredEntries} />
          )}
          {selectedSport === "all" && selectedSport != "start" && (
            <Entry
              filteredByDate={allSupabaseSports}
              filteredEntries={filteredEntries}
            />
          )}
          {selectedSport != "all" &&
            selectedSport !== "daily" &&
            selectedSport != "start" && (
              <Entry
                filteredEntries={filteredEntries}
                allSupabaseSports={allSupabaseSports}
              />
            )}
        </div>

        {/*  -------------------------- SUMMARY SECTION  -------------------------- */}

        {selectedSport != "daily" && selectedSport != "start" && (
          <div className="w-full lg:w-6/12">
            <Calendar filteredByDate={filteredByDate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;