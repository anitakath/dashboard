import { useState } from "react";
//COMPONENTS
import BoardHeader from "../Main/BoardHeader/BoardHeader";
import Login from "../Login/Login";
import { useSelector, useDispatch } from "react-redux";
import { updateDate } from "@/store/CalendarReducer";
//STYLING 
import styles from "../../pages/statistics/Statistics.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLeftAndUpRightToCenter , faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";

import useFetchEntries from "@/custom-hooks/entries/useFetchEntries";
import { setAllSportsFromSupabase } from "@/store/sportReducer";
import FirstSection from "./FirstSection";
import SecondSection from "./SecondSection";
import RestDaysCalendar from "./RestDaysCalendar";
import HeatMap from "./HeatMap";
import Goals from "./Goals";

const Statistic = () =>{
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState({ year: currentYear, month: "All" });
  const [sport, setSport] = useState(null)
  const [isAnnualOpen, setIsAnnualOpen] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch= useDispatch()
  const [selectedMonth, setSelectedMonth] = useState("");
  const { fetchSportsData} = useFetchEntries()
  const userId = useSelector((state) => state.auth.userId)

  let annualBtn = isAnnualOpen ? faDownLeftAndUpRightToCenter :  faUpRightAndDownLeftFromCenter;

  const scrollUpHandler = (direction) => {
    const topElement = document.getElementById('statisticNavigation');

    if(direction === "up"){
      if(topElement){
        topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1. $2 $3"); // Aber das ist eher US-Format, also nicht passend
  };
  


  const handleYearChange = async (e) => {
    const year = parseInt(e.target.value);
    dispatch(updateDate({ month: selectedMonth, year }));

    //* REPLACE FETCHSPORTSDATABYSELECTEDYEAR WITH FETCHSPORTSDATA!!! */
    //* REPLACE FETCHSPORTSDATABYSELECTEDYEAR WITH FETCHSPORTSDATA!!! */
    //* REPLACE FETCHSPORTSDATABYSELECTEDYEAR WITH FETCHSPORTSDATA!!! */
    const currentDate = {
      year: year,
      month: null, // oder ggf. aktueller Monat?
      restDaysPerMonth: null,
    };

    // Fetch sports data for the selected year


    const entries = await fetchSportsData(userId, null, currentDate);
    await dispatch(setAllSportsFromSupabase(entries));
  };


  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll m-0 p-0 relative z-20" >
        {isLoggedIn && (
          <div className="border-2 relative">
            <BoardHeader allSupabaseSports={allSupabaseSports} />

            <h1 className={styles.title}> Statistics </h1>

          {/*}
            <div className="absolute left-16 top-24">
              change year
              <select
                name="year"
                id="year"
                className={styles.year_input}
                value={year}
                onChange={handleYearChange}
              >
                {[2023, 2024, 2025, 2026, 2027, 2028].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            
              </select>
          </div> */}


          <FirstSection 
          currentYear={currentYear}
          formatDate={formatDate}
          />

                        

            <div className="flex my-2 items-center">
              <h1 className={styles.title}>
                Bar Charts for
                <span
                  style={{ color: "var(--purpleDark)", margin: "0px 10px" }}
                >
                  {date.year}
                </span>
                <button
                  onClick={() => setIsAnnualOpen((prevState) => !prevState)}
                >
                  <FontAwesomeIcon icon={annualBtn} className={styles.icon} />
                </button>
              </h1>
            </div>

            {isAnnualOpen && (
              <SecondSection
                allSupabaseSports={allSupabaseSports}
                date={date}
                setDate={setDate}
              />
            )}


            <h1 className="text-xl w-full flex mx-4 my-4 mt-10 justify-center items-center ">
                rest days in {date.year} ...
            </h1>


            <RestDaysCalendar 
            allSupabaseSports={allSupabaseSports}
            date={date} 
            />

            {sport != null && (
               <div className="flex relative border-8 justify-between" id="sportsOverview" >
               <h1 className={styles.title}>
                 Annual overview for
                 {sport != null && (
                   <span
                   style={{ color: "var(--purpleDark)", margin: "0px 10px" }}
                 >
                   {sport}
                 </span>
                 )}
               </h1>
               {sport === null && (
               <h2 className="ml-2 text-xs absolute bottom-1 left-20"> (please select a sport from the navigation above) </h2>
               )}
               <button className=" absolute right-4 top-0 md:top-3 z-50 hover:text-red-300 " onClick={() =>scrollUpHandler("up")}> go up </button>
             </div>
            )}

           

   


            <h1 className="text-xl w-full flex mx-4 my-4 mt-10 justify-center items-center ">
                A Github inspired Heatmap
            </h1>

            <HeatMap
            allSupabaseSports={allSupabaseSports}
            date={date} 
            />


            <h1 className="text-xl w-full flex mx-4 my-4 mt-10 justify-center items-center ">
            Set and track your goals!
            </h1>
            <Goals />

            
          </div>
        )}

        {!isLoggedIn && <Login />}
      </div>
    </div>
  );

}

export default Statistic;