import React from "react";
import styles from "./Heatmap.module.css";
import {
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  format,
  getDay,
  parseISO,
  differenceInCalendarWeeks,
} from "date-fns";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const HeatMap = ({ allSupabaseSports, date }) => {
  const year = date.year;
  const days = eachDayOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 11, 31)),
  });

  const dayCounts = {};
  allSupabaseSports.forEach((entry) => {
    const day = format(parseISO(entry.created_at), "yyyy-MM-dd");
    if (!dayCounts[day]) {
      dayCounts[day] = 0;
    }
    dayCounts[day]++;
  });

  const getLevel = (count) => {
    if (count >= 4) return styles.ultra;
    if (count === 3) return styles.maxi;
    if (count === 2) return styles.midi;
    if (count === 1) return styles.mini;
    return "";
  };

  const monthPositions = {};
  days.forEach((day) => {
    const week = differenceInCalendarWeeks(
      day,
      startOfYear(new Date(year, 0, 1)),
      { weekStartsOn: 1 }
    );
    const month = format(day, "MMM");
    if (!monthPositions[month]) {
      monthPositions[month] = week;
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.monthLabels}>
        {monthLabels.map((month) => (
          <div
            key={month}
            className={styles.month}
            style={{ gridColumnStart: (monthPositions[month] ?? 0) + 1 }}
          >
            {month}
          </div>
        ))}
      </div>

      <div className={styles.gridWrapper}>
        {/* Weekday Labels */}
        <div className={styles.weekdayLabels}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.weekday}>
              {weekdayLabels[i]}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className={styles.grid}>
          {days.map((day) => {
            const formatted = format(day, "yyyy-MM-dd");
            const count = dayCounts[formatted] || 0;
            const dayOfWeek = (getDay(day) + 6) % 7; // Montag = 0
            const week = differenceInCalendarWeeks(
              day,
              startOfYear(new Date(year, 0, 1)),
              { weekStartsOn: 1 }
            );

            return (
              <div
                key={formatted}
                className={`${styles.box} ${getLevel(count)}`}
                title={`${formatted} – ${count} session${count === 1 ? "" : "s"}`}
                style={{
                  gridColumn: week + 1,
                  gridRow: dayOfWeek + 1,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
