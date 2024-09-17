import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './MobileNavigation.module.css'
import { useSelector } from 'react-redux'
import SortSports from './SortSports'


const MobileNavigation = (props) =>{
  const deleteSportHandler = props.deleteSportHandler;
  const uniqueSports = props.uniqueSports
  const active = props.active
  const navigationArr = props.navigationArr;
  const handleSportClick = props.handleSportClick
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const mobileSportsNavIsOpen = props.mobileSportsNavIsOpen
  const setMobileSportsNavIsOpen = props.setMobileSportsNavIsOpen;
  const setUniqueSports = props.setUniqueSports;
  const allSupabaseSports = props.allSupabaseSports
  const setFormIsOpen = props.setFormIsOpen
  const formIsOpen = props.formIsOpen

  const addSportClickHandler = props.addSportClickHandler;


  let btn_text = mobileSportsNavIsOpen ? "close" : "open";

  return (
    <div className="w-full p-2 flex-col lg:hidden  overflow-scroll">
      <button
        onClick={() => setMobileSportsNavIsOpen(!mobileSportsNavIsOpen)}
        className="primary_button"
      >
        {btn_text} sports
      </button>
      {mobileSportsNavIsOpen && (
        <SortSports
          uniqueSports={uniqueSports}
          setUniqueSports={setUniqueSports}
          allSupabaseSports={allSupabaseSports}
        />
      )}
      {mobileSportsNavIsOpen && (
        <ul className={styles.ul}>
          {uniqueSports.map((sport, index) => (
            <div className="relative flex-col" key={index}>
              <li key={index} className="flex">
                <button
                  className={`${styles.sport_btn} ${
                    active === sport && selectedSport != "all"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleSportClick(sport)}
                >
                  <button
                    className={styles.delete_btn}
                    onClick={() => deleteSportHandler(sport)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={styles.trash_icon}
                    />
                  </button>
                  <span className={styles.sportBtnText}>{sport}</span>
                  {navigationArr &&
                    navigationArr.map((sportsObj, index) => {
                      if (sportsObj.name === sport) {
                        return (
                          <div className={styles.circle_div} key={index}>
                            <div
                              className={`${styles.circle_background} ${
                                styles[sportsObj.color]
                              } `}
                            ></div>
                            <div
                              className={`${styles[sportsObj.color]} ${
                                styles.circle
                              }`}
                            ></div>
                          </div>
                        );
                      }
                      return null;
                    })}
                </button>
              </li>
            </div>
          ))}
          <li className="flex relative items-center">
            <button
              className={styles.addSport_btn}
              onClick={addSportClickHandler}
            >
              {formIsOpen ? "-" : "+"}
            </button>
            <span className="relative top-0.5 mx-1 text-zinc-400">
              {" "}
              add a new sport{" "}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

export default MobileNavigation;