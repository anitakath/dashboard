import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"

import BoardHeader from "@/components/Main/BoardHeader/BoardHeader";
import styles from './Statistics.module.css'

const Statistics = () =>{


    const currentSport = useSelector((state) => state.sport.currentSport[0]);

    console.log(currentSport);


    return (
      <div className="w-full h-screen m-0 md:p-14">
        <div className="flex flex-col w-full border-2 h-full overflow-scroll p-2 m-0 p-0 relative z-20">
          <BoardHeader />
          <h1 className="text-2xl mb-2"> Statistics </h1>
          <div className={styles.grid_div}>
            {currentSport &&
              currentSport.map((sport) => (
                <div
                  key={sport.id}
                  className={`${styles.sport_div} ${styles[sport.color]}`}
                >
                  <button className="text-xs text-center hover:font-bold">
                    {sport.name}
                  </button>
                </div>
              ))}
          </div>
          <div className="flex flex-col lg:flex-row items-center my-4 md:mx-2">
            <button className="secondary_button"> select year </button>
            <button className="secondary_button"> select month </button>
            <p className="mx-4 my-4 lg:my-0">
              <span className={styles.selected_span}>selected:</span>
              current year && all months
            </p>
          </div>

          <div className={styles.playground}>
            <div className="border-2 flex  my-2">
              <h1 className="text-center w-full">
                your favourite sports this year ...
              </h1>
              <div className="h-20 bg-red-200 w-full">
                1. Poledance 2. Yoga 3. Figure Skating
              </div>
            </div>

            <div className="border-2 flex my-2 overflow-scroll">
              <h1 className="text-center w-full">Total hours per sport ...</h1>
              <div className="h-20 bg-red-200 w-full">
                -Show the total number of hours spent on each sport per year /
                per month
                <br/> <br/> 
                -Calculate the average duration of training sessions
                for each sport and in total.
              </div>
            </div>

            <div className="border-2 flex my-2 ">
              <h1 className="text-center w-full">Rest days ... </h1>
              <div className="h-20 bg-red-200 w-full">
                Show the total number of hours rest days ... active (sauna)
                passive (no entries)
              </div>
            </div>
          </div>

          <p>
            <br />
            <br />
            
            Anzahl der Trainingseinheiten: Zähle, wie viele Einheiten pro
            Sportart und insgesamt absolviert wurden.
            <br />
            <br />
            Häufigkeit der Sportarten: Analysiere, wie oft jede Sportart in
            einem bestimmten Zeitraum (z.B. Woche, Monat) trainiert wurde.
            <br />
            <br />
            Fortschritt über Zeit: Visualisiere den Fortschritt in Form von
            Diagrammen, z.B. die Anzahl der Stunden oder Einheiten pro
            Woche/Monat im Zeitverlauf. Zielverwirklichung: Halte fest, wie
            viele der gesetzten Ziele erreicht wurden (z.B. Anzahl der geplanten
            vs. tatsächlich durchgeführten Einheiten).
            <br />
            <br />
            Erlernte Fähigkeiten: Halte fest, welche spezifischen Fähigkeiten
            oder Techniken in jeder Einheit erlernt wurden und analysiere den
            Fortschritt in diesen Bereichen. <br />
            <br /> Wöchentliche/monatliche Trends: Analysiere Trends im Training
            über verschiedene Zeiträume hinweg (z.B. Steigerung oder Rückgang
            der Trainingshäufigkeit).
            <br />
            <br /> Vergleich mit vorherigen Zeiträumen: Erlaube den Nutzern,
            ihre aktuellen Statistiken mit denen aus vorherigen Monaten oder
            Jahren zu vergleichen. <br />
            <br />
            Kombinierte Statistiken: Biete eine Übersicht über kombinierte
            Statistiken an (z.B. Gesamtdauer aller Sportarten zusammen). <br />
            <br />
            Erholungszeiten: Halte fest, wie viel Zeit zwischen den
            Trainingseinheiten vergangen ist und analysiere dies im Hinblick auf
            Erholung und Leistung.
            <br />
            <br /> Verletzungen oder Ausfallzeiten: Dokumentiere Zeiten, in
            denen Nutzer aufgrund von Verletzungen oder anderen Gründen nicht
            trainieren konnten. <br />
            <br />
            Motivationsfaktoren: Frage nach den Hauptmotiven für das Training
            (z.B. Fitness, Spaß, Wettkampf) und analysiere deren Einfluss auf
            die Trainingshäufigkeit. <br />
            <br />
            Indem du diese Statistiken sammelst und darstellst, kannst du den
            Nutzern helfen, ein besseres Verständnis für ihre Fortschritte zu
            entwickeln und motiviert zu bleiben!
          </p>
        </div>
      </div>
    );
}

export default Statistics