import Link from "next/link";
import { useState } from "react";
//COMPONENTS
import BoardHeader from "../Main/BoardHeader/BoardHeader";
import StatisticNavigation from "./StatisticNavigation";
import SelectTimePeriod from "./FirstSection/SelectTimePeriod";
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



  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll m-0 p-0 relative z-20">
        {isLoggedIn && (
          <div>
            <BoardHeader allSupabaseSports={allSupabaseSports} />

            <h1 className="text-xl text-center mt-2 mb-4"> Statistics </h1>

            <StatisticNavigation currentSport={currentSport} sport={sport} setSport={setSport}/>
            

            <div className="flex items-center">
              <h1 className="text-xl w-full p-2">
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

            <div className="flex relative flex-col lg:flex-row mb-2 h-20  md:mx-2">
              <SelectTimePeriod date={date} setDate={setDate} />
            </div>

            {isAnnualOpen && (
              <Annual
                allSupabaseSports={allSupabaseSports}
                date={date}
                setDate={setDate}
              />
            )}

            <div className="">
              <h1 className="text-xl my-4 p-2">
                Annual overview for
                {sport != null && (
                  <span
                  style={{ color: "var(--purpleDark)", margin: "0px 10px" }}
                >
                  {sport}
                </span>
                )}
                {sport === null && (
                  <span>: please select a sport from the navigation above</span>
                )}
                
              </h1>
            </div>

            {sport != null && (

              <SportsOverView />

            )}


           
          </div>
        )}

        {!isLoggedIn && <Login />}
      </div>
    </div>
  );

}

export default Statistic;