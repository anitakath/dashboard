import Link from 'next/link';
import styles from '../Board.module.css'
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBars, faCalendar } from "@fortawesome/free-solid-svg-icons";
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

  let icon = miniMenu ? faXmark : faBars 

    
  const scrollToCalendar = () => {
    const calendarElement = document.getElementById("calendar");
    if (calendarElement) {
      calendarElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mb-2 flex flex-wrap justify-center relative bottom-2">
      <div className="relative w-full h-8">
        <button
          className="absolute top-2 left-2 lg:hidden"
          onClick={closeMiniMenuHandler}
        >
          <FontAwesomeIcon icon={icon} className="text-xl hover:text-red-300" />
        </button>
        <button
          className="absolute top-2 left-10 lg:hidden"
          onClick={scrollToCalendar}
        >
          <FontAwesomeIcon
            icon={faCalendar}
            className="text-xl hover:text-red-300"
          />
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
            your diary
          </Link>
          <Link className="primary_link" href="/statistics">
            your statistics
          </Link>
        </div>
      )}

      {formIsOpen && currentSport != "all" && currentSport != "daily" && <AddEntryForm setFormIsOpen={setFormIsOpen} />}
    </div>
  );
};

export default BoarderSubHeader