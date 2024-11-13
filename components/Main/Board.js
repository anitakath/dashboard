import { useEffect } from "react";
//STYLES
import styles from './Board.module.css'
//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";
//REDUX
import { useSelector, useDispatch} from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
//COMPONENTS
import HowToUseThisApp from "./HowToUseThisApp.js/HowToUseThisApp";
import Calendar from "./Calendar";
import Entry from "./Entry";
import Navigation from "../Navigation/Navigation";
import SummarizedEntries from "./Daily/SummarizedEntries";
import UserImageMobile from "../UI/UserImageMobile";
//HOOK
import useAuth from "@/custom-hooks/auth/useAuth";
import useFilterAndSortEntries from "@/custom-hooks/entries/useFilterAndSortEntries";
import BoardHeader from "./BoardHeader/BoardHeader";
import BoarderSubHeader from "./BoardHeader/BoarderSubHeader";
import useCalendar from "@/custom-hooks/useCalendar";
import { setFilteredEntriesByCurrentSport } from "@/store/sportReducer";

const Board = ({ filteredEntries}) => {
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const navigation = useSelector((state) => state.sport.navigation);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const actualDate = useSelector((state) => state.calendar);
  const { months } = useCalendar();
  const actualMonthIndex = months.findIndex((month) => month === actualDate.month);
  const actualMonth = actualMonthIndex + 1;
  const dispatch = useDispatch();
  const { logoutHandler } = useAuth();

  const filteredByDate = filteredEntries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1; // Monat von 0-11 zu 1-12 ändern
    return entryYear === actualDate.year && entryMonth === actualMonth;
  });
  const { filterEntriesByCurrentSportt } = useFilterAndSortEntries();
  //const { filterEntriesByCurrentSport } = useAuth();




  useEffect(() => {
    if (navigation.includes(selectedSport)) {
    } else {
      dispatch(setSelectedSport(navigation[0]));
    }
  }, []);


  useEffect(()=>{
    //filterEntriesByCurrentSport(allSupabaseSports, selectedSport)
    //console.log(filterEntriesByCurrentSport(allSupabaseSports, selectedSport));
    console.log(filterEntriesByCurrentSportt(allSupabaseSports, selectedSport))

    const getEntries = async() =>{
      const entries = await filterEntriesByCurrentSportt(allSupabaseSports, selectedSport)
      console.log(entries)
      dispatch(setFilteredEntriesByCurrentSport(entries.filterEntries));
    }

    getEntries()
  }, [selectedSport])


  return (
    <div className="w-full relative overflow-scroll flex flex-col items-center h-full p-2 ">
      <h1 className="title title_mini"> DASHBOARD </h1>

      <UserImageMobile />

      <BoardHeader logoutHandler={logoutHandler} />

      {/*---------------------- MOBILE NAVIGATION ---------------------- */}
      <div className="flex w-full lg:hidden">
        <Navigation />
      </div>

      <div className="flex justify-center  lg:flex-row flex-col w-full lg:max-h-screen  ">
        <div className={styles.entryField}>
          {selectedSport != "start" && (
            <h2 className="subtitle flex items-center text-center">
              {selectedSport === "all" && "all sports summarized per year and month"}
              {selectedSport === "daily" &&
                "all sports summarized per year and month in a calendar"}
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
            <BoarderSubHeader currentSport={selectedSport} />
          )}

          {/* --------------------------  THE ENTRIES -------------------------- */}

          {filteredByDate.length === 0 &&
            selectedSport != "all" &&
            selectedSport !== "daily" &&
            selectedSport != "start" && (
              <p className="m-2 text-xl"> no entries were made </p>
            )}
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