import { format, parseISO, isSameWeek, addDays, startOfWeek, compareAsc } from "date-fns";
import styles from "./PlannedSportsTable.module.css";
import colors from '../../../styles/Colors.module.css'


const getTimeSlot = (date) => {
  const hour = date.getHours();
  if (hour >= 5 && hour <= 13) return "morning";
  if (hour >= 14 && hour <= 17) return "afternoon";
  return "evening"; // 18–04 Uhr
};

const timeSlotLabels = {
  morning: "MORNING",
  afternoon: "AFTERNOON",
  evening: "EVENING",
};

const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const groupByWeek = (entries) => {
  const weeks = {};

  for (const group of entries) {
    for (const entry of group.entries) {
      const date = parseISO(entry.created_at);
      const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");

      if (!weeks[weekStart]) {
        weeks[weekStart] = [];
      }
      weeks[weekStart].push(entry);
    }
  }

  return weeks;
};

const PlannedSportsTable = ({ groupedEntries }) => {
  const weeklyGroups = groupByWeek(groupedEntries);

  // ⬇️ Sortiere Wochen aufsteigend (älteste zuerst)
  const sortedWeeks = Object.entries(weeklyGroups).sort(([a], [b]) =>
    compareAsc(parseISO(a), parseISO(b))
  );

  // ⬇️ Optional: nur Wochen ab dem 07.07.2025 (Montag) anzeigen
  const cutoffDate = parseISO("2025-07-07");
  const filteredWeeks = sortedWeeks.filter(([weekStart]) =>
    compareAsc(parseISO(weekStart), cutoffDate) >= 0
  );



  const handleWeekSelect = (e) => {
    const targetId = e.target.value;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.wrapper}>
      

      <div className={styles.selectWrapper}>

        <select id="week-select" onChange={handleWeekSelect}>
        <option value="">— choose a week —</option>
        {filteredWeeks.map(([weekStart]) => (
            <option key={weekStart} value={weekStart}>
            Woche ab {format(parseISO(weekStart), "dd.MM.yyyy")}
            </option>
        ))}
        </select>
    </div>


      {filteredWeeks.map(([weekStart, weekEntries]) => {
        const start = parseISO(weekStart);

        const weekStructure = {};
        for (let i = 0; i < 7; i++) {
          const currentDay = addDays(start, i);
          const dayStr = format(currentDay, "yyyy-MM-dd");

          weekStructure[dayStr] = {
            morning: [],
            afternoon: [],
            evening: [],
          };
        }

        for (const entry of weekEntries) {
          const date = parseISO(entry.created_at);
          const dayStr = format(date, "yyyy-MM-dd");
          const slot = getTimeSlot(date);
          if (weekStructure[dayStr]) {
            weekStructure[dayStr][slot].push(entry);
          }
        }

        return (
          <div key={weekStart} className={styles.week} id={weekStart}>
            <h2 className={styles.weekTitle}>
              Woche ab {format(parseISO(weekStart), "dd.MM.yyyy")}
            </h2>

            <div className={styles.table}>
              <div className={styles.cell + " " + styles.header}>Zeit</div>
              {weekdays.map((day, idx) => (
                <div key={idx} className={styles.cell + " " + styles.header}>
                  {day} 
                </div>
              ))}

              {["morning", "afternoon", "evening"].map((slot) => (
                <>
                  <div className={styles.cell + " " + styles.slotLabel}>
                    <p className="text-xs pt-4"> {timeSlotLabels[slot]} </p>
                  </div>
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const currentDay = format(addDays(start, idx), "yyyy-MM-dd");
                    const entries = weekStructure[currentDay]?.[slot] || [];


                    const labels = entries.map((entry) => entry.label)

                    
                    return (
                      <div key={idx} className={styles.cell}>
                        {entries.map((e) => (
                        <div key={e.id} className={`${styles.card} ${colors[e.label] || ""}`}>
                            <div className={styles.cardTitle}>{e.title}</div>
                            <p>{entries.label}</p>
                            <div className={styles.cardNote}>{e.entry}</div>
                            <div className={styles.cardTime}>{e.duration} min</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlannedSportsTable;
