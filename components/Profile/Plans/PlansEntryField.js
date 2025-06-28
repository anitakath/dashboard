import { useState } from "react";
import Tooltip from '../../UI/Tooltip'
import styles from "./PlansEntryField.module.css";

//HOOKS
import useFormatDate from "@/custom-hooks/times_and_dates/useFormatDate";


const PlansEntryField = ({sortedSportsArray, enlargeWorkoutHandler, editSportHandler, checkSportHandler, deleteSportHandler, openDetailsIds, isLoading }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const handleMouseEnter = (text) => {
    setTooltipText(text);
    setTooltipVisible(true);
  };
  const handleMouseLeave = () => {
    setTooltipVisible(false);
    setTooltipText('');
  };
  // Sortiere nach dem Erstellungsdatum aufsteigend (ältestes Datum zuerst)
  const sortedByDate = [...sortedSportsArray].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const [layoutMode, setLayoutMode] = useState("list");
  const {formatDate, formatTime} = useFormatDate()
  const [expandedGroupId, setExpandedGroupId] = useState(true);

  const toggleLayout = () => {
    setLayoutMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  
  };


  // Funktion zum Gruppieren der Objekte nach Datum
  function groupByDate(entries) {
  const grouped = {};

  entries.forEach((entry) => {
    // Extract the date (without time)
    const date = new Date(entry.created_at).toISOString().split("T")[0];

    // If the date does not yet exist in the group object, create it
    if (!grouped[date]) {
      grouped[date] = {
        dateTitle: new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        entries: [],
      };
    }

    // Add the current entry to the corresponding group
    grouped[date].entries.push(entry);
  });
  // Convert the group object back into an array and sort by date
  return Object.values(grouped).sort(
    (a, b) => new Date(b.dateTitle) - new Date(a.dateTitle)
  );
  }

  const groupedEntries = groupByDate(sortedByDate);

  const handleGroupClick = (dateTitle) => {
    // Toggle the expanded group
    setExpandedGroupId(expandedGroupId === dateTitle ? null : dateTitle);
  };


  return (
    <div className="w-full">
      <button onClick={toggleLayout} className={styles.layout_btn}>
        LAYOUT
      </button>

      <div
        className={`${styles.field} ${
          layoutMode === "grid" ? styles.grid : styles.list
        }`}
      >
        {groupedEntries &&
          groupedEntries
            .slice()
            .reverse()
            .map((group) => (
              <div key={group.dateTitle} className={styles.sportItem}>
              
              
                  <button 
                    className={styles.date_title} 
                    onClick={() => handleGroupClick(group.dateTitle)}
                  >
                    {group.dateTitle}
                  </button>
               

                {expandedGroupId != group.dateTitle && (

                  <div className="w-full">
                    {group.entries.map((sport) => (
                    <div
                      key={sport.entryId}
                      className={`${styles.sport_entry_div} ${styles[sport.label+"_bg"]}`}
                    >
                    <div className=" h-full relative">
                      <div className="relative h-full flex flex-col items-center">
                    
                     
                      <button className={styles.enlarge_btn} onClick={() => layoutMode === "grid" ? enlargeWorkoutHandler(sport.entryId) : enlargeWorkoutHandler(sport.entryId)}>
                      🔍
                      </button>
                      <div className="w-full flex flex-col items-center mt-4">
                          <h1
                            className="w-full mb-2 text-center hover:text-red-800 text-s md:text-xl cursor-pointer"
                            onClick={() => enlargeWorkoutHandler(sport.entryId)}
                          >
                            {sport.title}
                          </h1>
                          <h2 className={styles.created_at_h2}>
                            {formatDate(sport.created_at)} - {formatTime(sport.created_at)} 
                          </h2>
                          <h3 className={styles.duration_h3}>
                            {sport.duration} min
                          </h3>
                      </div>

                      <div className="absolute bottom-0 right-0">
                        <button className=" text-xs">
                          {sport.provider}
                        </button>

                      </div>
                    
                      <div
                          className={`${styles.sport_entry_details} ${
                            openDetailsIds.includes(sport.entryId)
                              ? styles.expanded
                              : styles.collapsed
                          }`}
                        >
                          {openDetailsIds.includes(sport.entryId) && (
                            <>
                              <h3 className="hidden sm:flex">
                                - {sport.title} -
                              </h3>
                              <p>{sport.entry}</p>
                            </>
                          )}
                      </div>
                      {(openDetailsIds.includes(sport.entryId)) && (
                        <div
                            className={`flex relative min-w-60  justify-center m-2 p-1`}
                        >
                          {isLoading === null && (
                            <div className=" ">
                              <button
                                className={styles.action_btns}
                                onClick={() => deleteSportHandler(sport)}
                                onMouseEnter={() => handleMouseEnter('Delete entry')}
                                onMouseLeave={handleMouseLeave}
                              >
                                🚮
                              </button>
                              <button
                                  className={styles.action_btns}
                                  onClick={() => checkSportHandler(sport)}
                                  onMouseEnter={() => handleMouseEnter('Check entry')}
                                  onMouseLeave={handleMouseLeave}
                              >
                                  ✔️
                              </button>
                              <button
                                  className={styles.action_btns}
                                  onClick={() => editSportHandler(sport)}
                                  onMouseEnter={() => handleMouseEnter('Edit entry')}
                                  onMouseLeave={handleMouseLeave}
                              >
                                  ✍🏼
                              </button>
                            </div>
                          )}
                          
                          {isLoading === "checkPlannedSport" && (
                            <div className="absolute bottom-4 h-10 z-10">
                              <h1> completing entry.... </h1>
                            </div>
                          )}

                          {tooltipVisible && <Tooltip text={tooltipText} /> }

                          </div>
                        )}
                      </div>
                      
                    </div>
                    
                  </div>
                 
                ))}
              </div>
              )}


     
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlansEntryField;
