import React from "react";
import { format, parseISO } from "date-fns";
import styles from "./PlannedSportsTableMobile.module.css";
import colors from "../../../styles/Colors.module.css";
import {  addDays } from "date-fns";
//CUSTOM HOOKS
import usePlannedSports from "@/custom-hooks/times_and_dates/usePlannedSports";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const PlannedSportsTableMobile = ({ addSportClickHandler, formIsOpen, setFormIsOpen, filteredWeeks }) => {

  const {getTimeSlot, daysOfWeek} = usePlannedSports()


  return (
    <div className={styles.mobile_container}>
      {filteredWeeks.map(([weekStart, weekEntries]) => {
        // Erzeuge ein Objekt mit Tagen als Schlüssel und Tageszeiten-Gruppierung
        const daysMap = {};

        // Initialisiere Wochentage
        for (let i = 0; i < 7; i++) {
          const day = addDays(parseISO(weekStart), i);
          const dateKey = format(day, "yyyy-MM-dd");
          daysMap[dateKey] = { date: day, morning: [], afternoon: [], evening: [] };
        }

        // Sortiere Einträge nach created_at und verteile sie in daysMap
        [...weekEntries]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .forEach((entry) => {
            const date = parseISO(entry.created_at);
            const dayKey = format(date, "yyyy-MM-dd");
            const timeOfDay = getTimeSlot(date);

            // Wenn der Tag zur Woche gehört
            if (daysMap[dayKey]) {
              daysMap[dayKey][timeOfDay].push(entry);
            }
          });

        return (
          <div key={weekStart} className={styles.week}>
            <h2 className={styles.weekTitle}>
              Week from {format(parseISO(weekStart), "dd.MM.yyyy")}
            </h2>

            {Object.entries(daysMap).map(([dateKey, { date, morning, afternoon, evening }]) => {
              const dayName = format(date, "EEEE"); // z. B. "Thursday"
              const fullDate = format(date, "dd.MM.yyyy");

              return (
                <div key={dateKey} className={styles.daySection} id={weekStart}>
                  <h3 className={styles.dayTitle}>{dayName}, {fullDate}</h3>

                  {morning.length === 0 && afternoon.length === 0 && evening.length === 0 && (
                    <div className={`${styles.card} ${styles.info}`}>
                      <h1> no sport units have been planned for today</h1>
                   </div>
                  )}

                  {morning.length > 0 && (
                    <>
                      <h4 className={styles.timeOfDay}>Morning</h4>
                      {morning.map((entry) => (
                        <div key={entry.id} className={`${styles.card} ${colors[entry.label] || ""}`}>
                          <div className={styles.date}>
                            {format(parseISO(entry.created_at), "dd.MM.yyyy, HH:mm")} Uhr
                          </div>
                          <div className={styles.title}>{entry.title}</div>
                          <div className={styles.note}>{entry.entry}</div>
                          <div className={styles.duration}>{entry.duration} min</div>
                          <div className={styles.image_container}>
                            {/*image div*/}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
              

                  {afternoon.length > 0 && (
                    <>
                      <h4 className={styles.timeOfDay}>Afternoon</h4>
                      {afternoon.map((entry) => (
                        <div key={entry.id} className={`${styles.card} ${colors[entry.label] || ""}`}>
                          <div className={styles.date}>
                            {format(parseISO(entry.created_at), "dd.MM.yyyy, HH:mm")} Uhr
                          </div>
                          <div className={styles.title}>{entry.title}</div>
                          <div className={styles.note}>{entry.entry}</div>
                          <div className={styles.duration}>{entry.duration} min</div>
                          <div className={styles.image_container}>
                            {/*image div*/} 
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                

                  {evening.length > 0 && (
                    <>
                      <h4 className={styles.timeOfDay}>Evening</h4>
                      {evening.map((entry) => (
                        <div key={entry.id} className={`${styles.card} ${colors[entry.label] || ""}`}>
                          <div className={styles.date}>
                            {format(parseISO(entry.created_at), "dd.MM.yyyy, HH:mm")} Uhr
                          </div>
                          <div className={styles.title}>{entry.title}</div>
                          <div className={styles.note}>{entry.entry}</div>
                          <div className={styles.duration}>{entry.duration} min</div>
                          <div className={styles.image_container}>
                            {/*image div*/}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                 
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PlannedSportsTableMobile;