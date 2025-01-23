import { useState, useEffect } from "react";
import Tooltip from '../../UI/Tooltip'

import styles from "./PlansEntryField.module.css";
//HOOKS
import useFormatDate from "@/custom-hooks/times_and_dates/useFormatDate";
//REDUX
import { useDispatch } from "react-redux";
import { setAllPlannedSports } from "@/store/sportReducer";

const PlansEntryField = ({
  sortedSportsArray,
  enlargeWorkoutHandler,
  editSportHandler,
  checkSportHandler,
  deleteSportHandler,
  openDetailsIds,
  isLoading
}) => {
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
  const sortedByDate = [...sortedSportsArray].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const dispatch = useDispatch();
  const [layoutMode, setLayoutMode] = useState("list");
  const [enlargedEntryId, setEnlargedEntryId] = useState(null);
  const {formatDate} = useFormatDate()
  useEffect(() => {
    dispatch(setAllPlannedSports(sortedByDate));
  }, [sortedByDate]);

  const toggleLayout = () => {
    setLayoutMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
    setEnlargedEntryId(null);
  };

  const enlargeObject = (entryId) => {
    if (layoutMode === "grid") {
      setEnlargedEntryId((prevId) => (prevId === entryId ? null : entryId));
    }
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


  const actionButtons = [
    {
      label: '🚮',
      onClick: () => deleteSportHandler(sport),
      onMouseEnter: () => handleMouseEnter('Delete entry'),
      onMouseLeave: handleMouseLeave,
    },
    {
      label: '✔️',
      onClick: () => checkSportHandler(sport),
      onMouseEnter: () => handleMouseEnter('Check entry'),
      onMouseLeave: handleMouseLeave,
    },
    {
      label: '✍🏼',
      onClick: () => editSportHandler(sport),
      onMouseEnter: () => handleMouseEnter('Edit entry'),
      onMouseLeave: handleMouseLeave,
    },
  ]


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
                {enlargedEntryId === null && (
                  <h2 className={styles.date_title}>{group.dateTitle}</h2>
                )}
                {group.entries.map((sport) => (
                  <div
                    key={sport.entryId}
                    className={`${
                      enlargedEntryId === sport.entryId
                        ? styles.expanded_grid
                        : styles.collapsed_grid
                    } ${styles.sport_entry_div} ${styles[sport.label + "_bg"]}`}
                    style={{
                      display:
                        enlargedEntryId !== null &&
                        enlargedEntryId !== sport.entryId
                          ? "none"
                          : "block",
                    }}
                  >
                    <div>
                      <div className="relative flex flex-col items-center">
                     
                      <button className={styles.enlarge_btn} onClick={() => layoutMode === "grid" ? enlargeObject(sport.entryId) : enlargeWorkoutHandler(sport.entryId)}>
                      🔍
                      </button>
                      <div className="w-full flex flex-col items-center mt-4">
                          <h1
                            className=" text-s md:text-2xl cursor-pointer"
                            onClick={() => enlargeWorkoutHandler(sport.entryId)}
                          >
                            {sport.name}
                          </h1>
                          <h2 className={styles.created_at_h2}>
                            {formatDate(sport.created_at)}
                          </h2>
                          <h3 className={styles.duration_h3}>
                            {sport.duration} min
                          </h3>
                      </div>

                      <div className="absolute bottom-0 right-0">
                        <button>
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
                      {(openDetailsIds.includes(sport.entryId) || enlargedEntryId === sport.entryId) && (
                        <div
                            className={`flex relative min-w-60 justify-center m-2 p-1${
                              enlargedEntryId !== sport.entryId
                                ? ""
                                : "relative"
                            }`}
                            style={
                              enlargedEntryId !== sport.entryId
                                ? {}
                                : { position: "relative", top: "200px" }
                            }
                        >
                          {isLoading === null && (
                            <div>
                             {actionButtons.map((button, index) => (
                                <button
                                  key={index}
                                  className={styles.action_btns}
                                  onClick={button.onClick}
                                  onMouseEnter={button.onMouseEnter}
                                  onMouseLeave={button.onMouseLeave}
                                >
                                  {button.label}
                                </button>
                              ))}
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
                    {(openDetailsIds.includes(sport.entryId) ||
                      enlargedEntryId === sport.entryId) && (
                      <div
                        className={`flex justify-center m-2 p-1${
                          enlargedEntryId !== sport.entryId ? "" : "relative"
                        }`}
                        style={
                          enlargedEntryId !== sport.entryId
                            ? {}
                            : { position: "relative", top: "200px" }
                        }
                      ></div>
                    )}
                  </div>
                 
                ))}
              </div>
            ))}
      </div>
    </div>
  );
};

export default PlansEntryField;
