import { useState } from "react";
//COMPONENTS
import BoardHeader from "../Main/BoardHeader/BoardHeader";
import Annual from "./Annual";
import Login from "../Login/Login";
import { useSelector } from "react-redux";
//STYLING 
import styles from "../../pages/statistics/Statistics.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLeftAndUpRightToCenter , faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import SportsOverView from "./SportsOverview";
import useStatistics from "@/custom-hooks/useStatistics";



const Statistic = () =>{
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState({ year: currentYear, month: "All" });
  const [sport, setSport] = useState(null)
  const [isAnnualOpen, setIsAnnualOpen] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [currentSport, setCurrentSport] = useState(null)

  let annualBtn = isAnnualOpen ? faDownLeftAndUpRightToCenter :  faUpRightAndDownLeftFromCenter;

  const scrollUpHandler = (direction) => {
    const topElement = document.getElementById('statisticNavigation');

    if(direction === "up"){
      if(topElement){
        topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  console.log(allSupabaseSports)
  console.log(currentYear)
  const { totalDuration, totalEntries, averageDuration,  activeDays, inactiveDays, averageDurationPerDay, longestStreak } = useStatistics(allSupabaseSports, 2025);




  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$1. $2 $3"); // Aber das ist eher US-Format, also nicht passend
  };
  



  return (
    <div className="w-full  h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll m-0 p-0 relative z-20" >
        {isLoggedIn && (
          <div>
            <BoardHeader allSupabaseSports={allSupabaseSports} />

            <h1 className={styles.title}> Statistics </h1>



           <div className="flex flex-col justify-center items-center"> 
            <h1 className="text-xl">   in {currentYear} you have completed: </h1>

              <div className="flex flex-col items-center w-11/12 my-3 p-4 shadow-sm bg-red-50">
        
                <p className="font-semibold text-red-700 text-xl my-2">{totalDuration}</p>
                <h1 className="text-lg text-gray-700"> hours of sport </h1>
              </div>

              <div className="flex flex-col items-center w-11/12 my-3 p-4 shadow-sm bg-red-50">
                <p className="font-semibold text-red-700 text-xl my-2">{totalEntries}</p>
                <h1 className="text-lg text-gray-700"> sports units </h1>
              </div>

              <div className="flex flex-col items-center w-11/12 my-3 p-4  shadow-sm bg-red-50">

                <p className="font-semibold text-red-700 text-xl my-2">{averageDurationPerDay}</p>
                <h1 className="text-lg text-gray-700"> average hours of sport per day </h1>
              </div>

              <div className="flex justify-center items-center w-11/12 my-3 p-4 shadow-sm bg-red-50">
                <div className="mx-6 flex flex-col items-center justify-center">
                  <p className="font-semibold text-red-700 text-xl my-2"> {activeDays} </p>
                  <h1 className="text-lg text-gray-700"> active sports days</h1>
                </div>
                <div className="mx-6 flex flex-col justify-center items-center">
                  
                  <p className="font-semibold text-red-700 text-xl my-2"> {inactiveDays} </p>
                  <h1 className="text-lg text-gray-700"> rest days</h1>
                </div>
              </div>

              <div className="flex flex-col items-center w-11/12 my-3 p-4  shadow-sm bg-red-50">

                <p className="font-semibold text-red-700 text-xl my-2"> {longestStreak.length} </p>
                <h1 className="text-lg text-gray-700"> days of sport in a row </h1>
              
                <p className="text-xs my-2"> there was no day of rest between {formatDate(longestStreak.from)} and {formatDate(longestStreak.to)} </p>
              </div>

            </div>

                        

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
              <Annual
                allSupabaseSports={allSupabaseSports}
                date={date}
                setDate={setDate}
              />
            )}


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

           

            <SportsOverView sport={sport}/>

            
          </div>
        )}

        {!isLoggedIn && <Login />}
      </div>
    </div>
  );

}

export default Statistic;