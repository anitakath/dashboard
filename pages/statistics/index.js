import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { useState } from "react";
import BoardHeader from "@/components/Main/BoardHeader/BoardHeader";
import styles from './Statistics.module.css'

//COMPONENTS
import Annual from "@/components/Statistics/Annual";
import SelectTimePeriod from "@/components/Statistics/SelectTimePeriod";

const Statistics = () =>{
  const currentSport = useSelector((state) => state.sport.currentSport[0]);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)


  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex flex-col w-full border-2 h-full overflow-scroll p-2 m-0 p-0 relative z-20">
        <BoardHeader allSupabaseSports={allSupabaseSports} />
        <h1 className="text-2xl mb-2"> Statistics </h1>
        <div className={styles.grid_div}>
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

          <SelectTimePeriod />
       
        </div>

        <div>
          <h1 className="text-2xl border-b-2"> Annual overview </h1>
        </div>

        <Annual allSupabaseSports={allSupabaseSports} />

        <div>
          <h1 className="text-2xl border-b-2"> monatliche Übersicht </h1>
        </div>

        <div className={styles.playground}></div>

        <p>
          <br />
          <br />
          Anzahl der Trainingseinheiten: Zähle, wie viele Einheiten pro Sportart
          und insgesamt absolviert wurden.
          <br />
          <br />
          Häufigkeit der Sportarten: Analysiere, wie oft jede Sportart in einem
          bestimmten Zeitraum (z.B. Woche, Monat) trainiert wurde.
          <br />
          <br />
          Fortschritt über Zeit: Visualisiere den Fortschritt in Form von
          Diagrammen, z.B. die Anzahl der Stunden oder Einheiten pro Woche/Monat
          im Zeitverlauf. Zielverwirklichung: Halte fest, wie viele der
          gesetzten Ziele erreicht wurden (z.B. Anzahl der geplanten vs.
          tatsächlich durchgeführten Einheiten).
          <br />
          <br />
          Erlernte Fähigkeiten: Halte fest, welche spezifischen Fähigkeiten oder
          Techniken in jeder Einheit erlernt wurden und analysiere den
          Fortschritt in diesen Bereichen. <br />
          <br /> Wöchentliche/monatliche Trends: Analysiere Trends im Training
          über verschiedene Zeiträume hinweg (z.B. Steigerung oder Rückgang der
          Trainingshäufigkeit).
          <br />
          <br /> Vergleich mit vorherigen Zeiträumen: Erlaube den Nutzern, ihre
          aktuellen Statistiken mit denen aus vorherigen Monaten oder Jahren zu
          vergleichen. <br />
          <br />
          Kombinierte Statistiken: Biete eine Übersicht über kombinierte
          Statistiken an (z.B. Gesamtdauer aller Sportarten zusammen). <br />
          <br />
          Erholungszeiten: Halte fest, wie viel Zeit zwischen den
          Trainingseinheiten vergangen ist und analysiere dies im Hinblick auf
          Erholung und Leistung.
          <br />
          <br /> Verletzungen oder Ausfallzeiten: Dokumentiere Zeiten, in denen
          Nutzer aufgrund von Verletzungen oder anderen Gründen nicht trainieren
          konnten. <br />
          <br />
          Motivationsfaktoren: Frage nach den Hauptmotiven für das Training
          (z.B. Fitness, Spaß, Wettkampf) und analysiere deren Einfluss auf die
          Trainingshäufigkeit. <br />
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