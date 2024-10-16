import Link from "next/link";
import { useState } from "react";
//COMPONENTS
import BoardHeader from "../Main/BoardHeader/BoardHeader";
import SelectTimePeriod from "./SelectTimePeriod";
import Annual from "./Annual";
import Login from "../Login/Login";
import { useSelector } from "react-redux";
//STYLING 
import styles from './Statistic.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartLine, faDownLeftAndUpRightToCenter , faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";

const Statistic = () =>{
  const currentSport = useSelector((state) => state.sport.currentSport);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState({ year: currentYear, month: "All" });
  const [isAnnualOpen, setIsAnnualOpen] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  let annualBtn = isAnnualOpen ? faDownLeftAndUpRightToCenter :  faUpRightAndDownLeftFromCenter;

  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll p-2 m-0 p-0 relative z-20">
       {isLoggedIn && <div>
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
            <h1 className="text-2xl w-full p-2">
              Annual overview for
              <span style={{ color: "var(--purpleDark)", margin: "0px 10px" }}>
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
          <Link href="/" className={styles.backToHomepage_link}>
            <FontAwesomeIcon icon={faHouse} />
          </Link>

          <div className={styles.playground}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>

          <p>
            - am Anfang des Monats wird pro Sport ein Ziel festgelegt, wie oft
            dieser trainiert werden soll.
            <br />
            - SOLL wird dann mit dem IST abgeglichen. zB Poledance 3x die Woche
            = 12x im Monat als Ziel / Xx IST dynamisch auf grundlage der Objekte
            im Monat X erstellt.
            <br />
            <br />
            - Top 3 Sportarten pro Monat
            <br />
            <br />
            - Sportart X : Stundenanzahl und Einheiten im (gewählten) Monat ( +
            Trend zum Vormonat durch Pfeil oder = )
            <br />
            <br />
            - Einheiten insgesamt
            <br />
            <br />
            - Anzahl der Stunden pro Sportarten pro Monat und im Zeitverlauf.
            GRAFISHCE DARSTELLUNG!
            <br />
            <br />
            - Verletzungen / Behinderungen
            <br />
            <br />- random Bildergalerie
          </p>
        </div>}

        {!isLoggedIn && <Login/>}
      </div>
    </div>
  );

}

export default Statistic;