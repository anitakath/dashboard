import { useState } from "react";
//COMPONENTS
import BoardHeader from "../Main/BoardHeader/BoardHeader";
import StatisticNavigation from "./StatisticNavigation";
import Annual from "./Annual";
import Login from "../Login/Login";
import { useSelector } from "react-redux";
//STYLING 
import styles from "../../pages/statistics/Statistics.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartLine, faDownLeftAndUpRightToCenter , faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import SportsOverView from "./SportsOverview";

const Statistic = () =>{
  const currentSport = useSelector((state) => state.sport.currentSport);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState({ year: currentYear, month: "All" });
  const [sport, setSport] = useState(null)
  const [isAnnualOpen, setIsAnnualOpen] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  let annualBtn = isAnnualOpen ? faDownLeftAndUpRightToCenter :  faUpRightAndDownLeftFromCenter;

  const scrollUpHandler = (direction) => {
    const topElement = document.getElementById('statisticNavigation');

    if(direction === "up"){
      if(topElement){
        topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };




  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll m-0 p-0 relative z-20" >
        {isLoggedIn && (
          <div>
            <BoardHeader allSupabaseSports={allSupabaseSports} />

            <h1 className={styles.title}> Statistics </h1>

            <StatisticNavigation currentSport={currentSport} sport={sport} setSport={setSport}/>
            

            <div className="flex my-2 items-center">
              <h1 className={styles.title}>
                Annual overview for
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

            <div className="flex relative  justify-between" id="sportsOverview" >
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

            <SportsOverView sport={sport}/>

            
          </div>
        )}

        {!isLoggedIn && <Login />}
      </div>
    </div>
  );

}

export default Statistic;