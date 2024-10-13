import { useState } from "react";
import { useEffect } from "react";

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import styles from "./PlansEntryField.module.css";
import colors from "../../../styles/Colors.module.css";
//HOOKS
import { formatDate } from "@/custom-hooks/formatDate";
//REDUX
import { useDispatch } from "react-redux";
import { setAllPlannedSports } from "@/store/sportReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faGripHorizontal } from "@fortawesome/free-solid-svg-icons";
const PlansEntryField = ({
  sortedSportsArray,
  enlargeWorkoutHandler,
  editSportHandler,
  checkSportHandler,
  deleteSportHandler,
  openDetailsIds,
}) => {
  // Sortiere nach dem Erstellungsdatum aufsteigend (ältestes Datum zuerst)
  const sortedByDate = [...sortedSportsArray].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const dispatch = useDispatch();
  const [layoutMode, setLayoutMode] = useState("list");
  const [enlargedEntryId, setEnlargedEntryId] = useState(null);

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

  return (
    <div className="w-full">
      <button onClick={toggleLayout} className={styles.layout_btn}>
        <FontAwesomeIcon
          className="hidden ssm:flex ml-2"
          icon={layoutMode === "list" ? faBars : faGripHorizontal}
        />
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
              <div key={group.dateTitle}>
                <h2 className={styles.date_title}>{group.dateTitle}</h2>
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
                        <button
                          className={styles.enlarge_btn}
                          onClick={() =>
                            layoutMode === "grid"
                              ? enlargeObject(sport.entryId)
                              : enlargeWorkoutHandler(sport.entryId)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faUpRightAndDownLeftFromCenter}
                            className={styles.enlarge_icon}
                          />
                        </button>
                        <div className="w-full flex flex-col items-center mt-4">
                          <h1
                            className="md:text-2xl cursor-pointer"
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
                        {(openDetailsIds.includes(sport.entryId) ||
                          enlargedEntryId === sport.entryId) && (
                          <div
                            className={`flex justify-center m-2 p-1${
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
                            <button className={styles.action_btns}>
                              <FontAwesomeIcon
                                icon={faXmark}
                                className={styles.delete_icon}
                                onClick={() => deleteSportHandler(sport)}
                              />
                            </button>
                            <button className={styles.action_btns}>
                              <FontAwesomeIcon
                                icon={faCheck}
                                className={styles.check_icon}
                                onClick={() => checkSportHandler(sport)}
                              />
                            </button>
                            <button className={styles.action_btns}>
                              <FontAwesomeIcon
                                icon={faPencil}
                                className={styles.edit_icon}
                                onClick={() => editSportHandler(sport)}
                              />
                            </button>
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
/*
const PlansEntryField = ({
  sortedSportsArray,
  enlargeWorkoutHandler,
  editSportHandler,
  checkSportHandler,
  deleteSportHandler,
  openDetailsIds,
}) => {
  // Create a copy of the array and sort it by created_at date (most recent first)
  const sortedByDate = [...sortedSportsArray].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const dispatch = useDispatch();
  const [layoutMode, setLayoutMode] = useState("list");
  const [enlargedEntryId, setEnlargedEntryId] = useState(null); // Zustand für das vergrößerte Objekt
  //const [enlargedEntryId, setEnlargedEntryId] = useState({ active: null }); // Zustand für das vergrößerte Objekt

  useEffect(() => {
    dispatch(setAllPlannedSports(sortedByDate));
  }, [sortedByDate]);

  const toggleLayout = () => {
    setLayoutMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
    setEnlargedEntryId(null);
  };

  console.log(sortedByDate);

  const enlargeObject = (entryId) => {
    if (layoutMode === "grid") {
      setEnlargedEntryId((prevId) => (prevId === entryId ? null : entryId)); // Toggle zwischen vergrößern und verkleinern
    }
  };

  return (
    <div className="w-full">
      <button onClick={toggleLayout} className={styles.layout_btn}>
        <FontAwesomeIcon
          icon={layoutMode === "list" ? faBars : faGripHorizontal}
        />
      </button>

      <div
        className={`${styles.field} ${
          layoutMode === "grid" ? styles.grid : styles.list
        }`}
      >
        {sortedByDate &&
          sortedByDate.map((sport) => (
            <div
              key={sport.entryId}
              className={`${
                enlargedEntryId === sport.entryId
                  ? styles.expanded_grid
                  : styles.collapsed_grid
              } ${styles.sport_entry_div} ${styles[sport.label + "_bg"]}`}
            >
              <div>
                <div className="relative flex flex-col items-center">
                  <button
                    className={styles.enlarge_btn}
                    onClick={() =>
                      layoutMode === "grid"
                        ? enlargeObject(sport.entryId)
                        : enlargeWorkoutHandler(sport.entryId)
                    }
                  >
                    <FontAwesomeIcon
                      icon={faUpRightAndDownLeftFromCenter}
                      className={styles.enlarge_icon}
                    />
                  </button>

                  <div className="w-full flex flex-col items-center mt-4">
                    <h1
                      className="md:text-2xl cursor-pointer"
                      onClick={() => enlargeWorkoutHandler(sport.entryId)}
                    >
                      {sport.name}
                    </h1>
                    <h2 className={styles.created_at_h2}>
                      {formatDate(sport.created_at)}
                    </h2>
                    <h3 className={styles.duration_h3}>{sport.duration} min</h3>
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
                        <h3 className="hidden sm:flex">- {sport.title} -</h3>
                        <p>{sport.entry}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {(openDetailsIds.includes(sport.entryId) ||
                enlargedEntryId === sport.entryId) && (
                <div className="flex justify-center m-2 p-1">
                  <button className={styles.action_btns}>
                    <FontAwesomeIcon
                      icon={faXmark}
                      className={styles.delete_icon}
                      onClick={() => deleteSportHandler(sport)}
                    />
                  </button>
                  <button className={styles.action_btns}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={styles.check_icon}
                      onClick={() => checkSportHandler(sport)}
                    />
                  </button>
                  <button className={styles.action_btns}>
                    <FontAwesomeIcon
                      icon={faPencil}
                      className={styles.edit_icon}
                      onClick={() => editSportHandler(sport)}
                    />
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlansEntryField;
*/