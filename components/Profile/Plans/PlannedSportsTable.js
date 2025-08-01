import { format, parseISO, isSameWeek, addDays, startOfWeek, compareAsc } from "date-fns";
import styles from "./PlannedSportsTable.module.css";
import colors from '../../../styles/Colors.module.css'
//COMPONENTS
import PlannedSportsTableMobile from "./PlannedSportsTableMobile";
import PlannedSportItemModal from "./Modals/PlannedSportItemModal";
//CUSTOM HOOKS
import usePlannedSports from "@/custom-hooks/times_and_dates/usePlannedSports";
import { useState } from "react";

const timeSlotLabels = {
  morning: "MORNING",
  afternoon: "AFTERNOON",
  evening: "EVENING",
};


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

const PlannedSportsTable = ({ addSportClickHandler, formIsOpen, setFormIsOpen, groupedEntries, deleteSportHandler, checkSportHandler }) => {

  const {getTimeSlot, weekdays} = usePlannedSports()
  const weeklyGroups = groupByWeek(groupedEntries);
  const [showModal, setShowModal] = useState({display: false, content: {} })

  // ⬇️ Sortiere Wochen aufsteigend (älteste zuerst)
  const sortedWeeks = Object.entries(weeklyGroups).sort(([a], [b]) =>
    compareAsc(parseISO(a), parseISO(b))
  );

  // ⬇️ Optional: nur Wochen ab dem 07.07.2025 (Montag) anzeigen
  const cutoffDate = parseISO("2025-07-07");
  const filteredWeeks = sortedWeeks.filter(([weekStart]) =>
    compareAsc(parseISO(weekStart), cutoffDate) >= 0
  );


  function extractTime(timeString) {
    const match = timeString.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : '';
  }
  

  const handleWeekSelect = (e) => {
    const targetId = e.target.value;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  const showModalHandler = (entry) => {
    setShowModal({display: true, content: entry})
  }

  console.log(showModal)

  return (
    <div className={styles.wrapper}>
      
      <div className={styles.selectWrapper}>

        <select id="week-select" onChange={handleWeekSelect}>
        <option value=""> choose a week </option>
        {filteredWeeks.map(([weekStart]) => (
            <option key={weekStart} value={weekStart}>
            Week from {format(parseISO(weekStart), "dd.MM.yyyy")}
            </option>
        ))}
        </select>
    </div>


    <PlannedSportsTableMobile
      filteredWeeks={filteredWeeks}
      formIsOpen={formIsOpen}
      setFormIsOpen={setFormIsOpen}
      addSportClickHandler={addSportClickHandler}
      setShowModal={setShowModal}
      showModal={showModal}
      deleteSportHandler={deleteSportHandler}
      checkSportHandler={checkSportHandler}
      showModalHandler={showModalHandler}
    />


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
              Week from {format(parseISO(weekStart), "dd.MM.yyyy")}
            </h2>

            {showModal && (
              <PlannedSportItemModal 
                setShowModal={setShowModal}
                showModal={showModal}
                deleteSportHandler={deleteSportHandler}
                checkSportHandler={checkSportHandler}
              /> 
              
            )}

            <div className={styles.table}>
              <div className={styles.cell + " " + styles.header + " " + styles.time}>Time</div>
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
                    
                    return (
                      <div key={idx} className={styles.cell}>
                        {entries.map((entry) => (
                        <button  onClick={() => showModalHandler(entry)} key={entry.id} className={`${styles.card} ${colors[entry.label] || ""}`}>
                            <p>{extractTime(entry.created_at)}</p>
                            <div className={styles.cardTitle}>{entry.title}</div>
                            <div className={styles.cardNote}>{entry.entry}</div>
                            <div className={styles.cardTime}>{entry.duration} min</div>
                          </button>
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
