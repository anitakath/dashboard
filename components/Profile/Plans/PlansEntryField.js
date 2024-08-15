import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import styles from './Plans.module.css'
import colors from '../../../styles/Colors.module.css'
//HOOKS
import { formatDate } from '@/custom-hooks/formatDate';
import { useEffect } from 'react';
//REDUX
import { useDispatch } from 'react-redux';
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
    <div className={styles.field}>
      {sortedByDate &&
        sortedByDate.map((sport) => (
          <div
            key={sport.entryId}
            className={`${styles.sport_entry_div} ${
              colors[sport.label + "_bg"]
            }`}
          >
            <div>
              <div className="relative flex flex-col items-center ">
                <button
                  className={styles.enlarge_btn}
                  onClick={() => enlargeWorkoutHandler(sport.entryId)}
                >
                  <FontAwesomeIcon
                    icon={faUpRightAndDownLeftFromCenter}
                    className={styles.enlarge_icon}
                  />
                </button>

                <div className="w-full flex flex-col items-center mt-4">
                  <h1
                    className="text-2xl cursor-pointer"
                    onClick={() => enlargeWorkoutHandler(sport.entryId)}
                  >
                    {sport.name}
                  </h1>
                  <h2>{formatDate(sport.created_at)}</h2>
                  <h3>{sport.duration} min </h3>
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