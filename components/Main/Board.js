import { useEffect } from "react";
//STYLES
import styles from './Board.module.css'
//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";
//REDUX
import { useSelector, useDispatch} from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
//COMPONENTS
import Calendar from "./Calendar";
import Entry from "./Entry";
import Navigation from "../Navigation/Navigation";
import SummarizedEntries from "./Daily/SummarizedEntries";
import UserImageMobile from "../UI/UserImageMobile";
//HOOK
import useAuth from "@/custom-hooks/auth/useAuth";
import BoardHeader from "./BoardHeader/BoardHeader";
import BoarderSubHeader from "./BoardHeader/BoarderSubHeader";
import useCalendar from "@/custom-hooks/useCalendar";

const Board = (props) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const navigation = useSelector((state => state.sport.navigation))
  const filteredEntries = props.filteredEntries;
  const sportsDurationByMonth = props.sportsDurationByMonth;
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const actualDate = useSelector((state) => state.calendar);
  const { months } = useCalendar();
  const actualMonthIndex = months.findIndex(month => month === actualDate.month);
  const actualMonth = actualMonthIndex + 1;
  const dispatch = useDispatch();
  const { logoutHandler } = useAuth();  
  
  const filteredByDate = filteredEntries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1; // Monat von 0-11 zu 1-12 ändern
    return entryYear === actualDate.year && entryMonth === actualMonth;
  });


  

  useEffect(()=> {
    if(navigation.includes(currentSport)){
    } else{
      dispatch(setSelectedSport(navigation[0]))
    }
  }, [navigation])


  const dailyAllHandler = () => {
    dispatch(setSelectedSport("daily"));
  };

  return (
    <div className="w-full relative overflow-scroll flex flex-col items-center h-full p-2 ">
      <h1 className="title title_mini"> DASHBOARD </h1>

      <UserImageMobile/>

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