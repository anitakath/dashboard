import Link from 'next/link';
import styles from '../Board.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
//COMPONENTS
import AddEntryForm from '../AddEntryForm';
import { useDispatch } from 'react-redux';
import { setSelectedSport } from '@/store/sportReducer';
import { setSection } from '@/store/profileReducer';

const BoarderSubHeader = ({ currentSport, dailyAllHandler }) => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [miniMenu, setMinimenu] = useState(true)
  const dispatch = useDispatch();

  const summarizeAllHandler = (e) => {
    e.preventDefault();
    dispatch(setSelectedSport("all"));
  };

  const addEntryHandler = (e) => {
    e.preventDefault();
    setFormIsOpen((prevFormIsOpen) => !prevFormIsOpen);
  };

  let addEntryText = formIsOpen ? "close form" : "add entry";

  const router = useRouter();

  const navigateToSportPlanHandler = () => {
    dispatch(setSection("plans"));
    router.push("/profile");
  };

  const closeMiniMenuHandler = (e) =>{
    e.preventDefault();
    setMinimenu(!miniMenu)

  }

  return (
    <div className="mb-2 flex flex-wrap justify-center relative bottom-2">
      <div className="relative w-full h-8">
        <button
          className="absolute top-2 left-2 lg:hidden"
          onClick={closeMiniMenuHandler}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      {miniMenu && (
        <div className="w-full relative right-1 flex flex-col lg:flex-row justify-center">
          {currentSport !== "all" && currentSport !== "daily" && (
            <button className="secondary_button" onClick={addEntryHandler}>
              <span className={styles.add_btn_icon}> + </span> {addEntryText}
            </button>
          )}

          <button
            className="secondary_button lg:hidden"
            onClick={dailyAllHandler}
          >
            daily overview
          </button>

          <button
            className="secondary_button lg:hidden"
            onClick={summarizeAllHandler}
          >
            summary of all sports
          </button>
          <button
            className="secondary_button"
            onClick={navigateToSportPlanHandler}
          >
            <FontAwesomeIcon
              icon={faCalendar}
              className={styles.calendar_icon}
            />
            planned sports units
          </button>
          {currentSport === "daily" && (
            <button className="secondary_button" onClick={summarizeAllHandler}>
              summary of all sports
            </button>
          )}
          {currentSport === "all" && (
            <button className="secondary_button" onClick={dailyAllHandler}>
              daily overview
            </button>
          )}
          <Link className="primary_link" href="/diary">
            go to your diary
          </Link>
        </div>
      )}

      {formIsOpen && <AddEntryForm setFormIsOpen={setFormIsOpen} />}
    </div>
  );
};

export default BoarderSubHeader