import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCheck, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import styles from './Plans.module.css'

//HOOKS
import { formatDate } from '@/custom-hooks/formatDate';
import { useEffect } from 'react';
//REDUX
import { useDispatch, useSelector } from 'react-redux';
import { setAllPlannedSports } from '@/store/sportReducer';
const PlansEntryField = ({sortedSportsArray, enlargeWorkoutHandler,  editSportHandler, deleteSportHandler, checkSportHandler, openDetailsIds}) =>{
  
  
  // Create a copy of the array and sort it by created_at date (most recent first)
  const sortedByDate = [...sortedSportsArray].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(setAllPlannedSports(sortedByDate));

  }, [sortedByDate])

  

  return (
    <div className=" w-full ">
      {sortedByDate &&
        sortedByDate.map((sport) => (
          <div
            key={sport.entryId}
            className={`${styles.sport_entry_div} ${
              styles[sport.label + "_bg"]
            }`}
          >
            <div>
              <div className="relative flex items-center">
                <div className={styles.sport_entry_title_div}>
                  <div
                    className={`${styles.sport_entry_name} ${
                      styles[sport.label]
                    }`}
                  >
                    <button
                      className={styles.enlarge_btn}
                      onClick={() => enlargeWorkoutHandler(sport.entryId)}
                    >
                      <FontAwesomeIcon
                        icon={faUpRightAndDownLeftFromCenter}
                        className={styles.enlarge_icon}
                      />
                    </button>
                    <h3>{sport.name}</h3>
                  </div>
                </div>

                <h2 className="text-xl mx-4"> - {sport.title}</h2>

                <h3 className={styles.sport_entry_date}>
                  {formatDate(sport.created_at)}
                  <span className={styles.sport_entry_duration}>
                    {sport.duration} min
                  </span>
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
                    <h3 className="hidden sm:flex">- {sport.title} -</h3>
                    <p>{sport.entry}</p>
                  </>
                )}
              </div>
            </div>

            {openDetailsIds.includes(sport.entryId) && (
              <div className=" flex justify-center m-2 p-1">
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
  );
}

export default PlansEntryField; 