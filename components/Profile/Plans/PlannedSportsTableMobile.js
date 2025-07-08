import React from "react";
import { format, parseISO } from "date-fns";
import styles from "./PlannedSportsTableMobile.module.css";
import colors from "../../../styles/Colors.module.css";

const PlannedSportsTableMobile = ({ filteredWeeks }) => {
  return (
    <div className={styles.mobile_container}>
      {filteredWeeks.map(([weekStart, weekEntries]) => (
        <div key={weekStart} className={styles.week}>
          <h2 className={styles.weekTitle}>
            Woche ab {format(parseISO(weekStart), "dd.MM.yyyy")}
          </h2>

          {[...weekEntries]
  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  .map((entry) => {
    const date = parseISO(entry.created_at);
    return (
      <div key={entry.id} className={`${styles.card} ${colors[entry.label] || ""}`}>
        <div className={styles.date}>{format(date, "dd.MM.yyyy, HH:mm")} Uhr</div>
        <div className={styles.title}>{entry.title}</div>
        <div className={styles.note}>{entry.entry}</div>
        <div className={styles.duration}>{entry.duration} min</div>
      </div>
    );
  })}

        </div>
      ))}
    </div>
  );
};

export default PlannedSportsTableMobile;
