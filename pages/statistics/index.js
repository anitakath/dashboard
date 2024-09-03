import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react";
import BoardHeader from "@/components/Main/BoardHeader/BoardHeader";
import styles from './Statistics.module.css'

//COMPONENTS
import Annual from "@/components/Statistics/Annual";
import SelectTimePeriod from "@/components/Statistics/SelectTimePeriod";
//FONT AWESOME
import { faDownLeftAndUpRightToCenter } from "@fortawesome/free-solid-svg-icons";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";


const Statistics = () =>{
  const currentSport = useSelector((state) => state.sport.currentSport[0]);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [date, setDate] = useState({ year: currentYear, month: "All" });
  const [isAnnualOpen, setIsAnnualOpen] = useState(true)


  let annualBtn = isAnnualOpen ? faDownLeftAndUpRightToCenter :  faUpRightAndDownLeftFromCenter;

  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll p-2 m-0 p-0 relative z-20">
        <BoardHeader allSupabaseSports={allSupabaseSports} />
        <h1 className="text-2xl mb-2"> Statistics </h1>
        <div className={styles.container_div}>
          {currentSport &&
            currentSport.map((sport) => (
              <div
                key={sport.id}
                className={`${styles.sport_div} ${styles[sport.color]}`}
              >
                <button className="text-m md:text-xl text-center hover:font-bold">
                  {sport.name}
                </button>
              </div>
            ))}
        </div>

        <div className="flex relative flex-col lg:flex-row my-4 md:mx-2">
          <SelectTimePeriod date={date} setDate={setDate} />
        </div>

        <div className="flex  h-10 items-center">
          <h1 className="text-2xl w-full border-b-2 my-4 p-2">
            Annual overview for
            <span style={{ color: "var(--purpleDark)", margin: "0px 10px" }}>
              {date.year}
            </span>
            <button onClick={() => setIsAnnualOpen((prevState) => !prevState)}>
              <FontAwesomeIcon icon={annualBtn} className={styles.icon} />
            </button>
          </h1>
        </div>

        {isAnnualOpen && (
          <Annual allSupabaseSports={allSupabaseSports} date={date} />
        )}

        <div>
          <h1 className="text-2xl border-b-2 my-4 p-2">
            monthly overview
            <span style={{ color: "var(--purpleDark)", margin: "0px 10px" }}>
              {date.month}
            </span>
          </h1>
        </div>

        <div className={styles.playground}>
          <FontAwesomeIcon icon={faChartLine} />
        </div>

        <p>
          - Top 3 Sportarten pro Monat 
          <br/>
          <br/>
          - Sportart X : Stundenanzahl und Einheiten im (gewählten) Monat ( +  Trend zum Vormonat durch Pfeil oder = )
          <br />
          <br />
          - Einheiten insgesamt
          <br />
          <br />
          - Anzahl der Stunden pro Sportarten pro Monat und im Zeitverlauf. GRAFISHCE DARSTELLUNG!
          <br />
          <br /> 
          - Verletzungen / Behinderungen 
          <br />
          <br />
          - random Bildergalerie 
      
        </p>
      </div>
    </div>
  );
}

export default Statistics