import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './MobileNavigation.module.css'
import { useSelector } from 'react-redux'

const MobileNavigation = (props) =>{
  const deleteSportHandler = props.deleteSportHandler;
  const uniqueSports = props.uniqueSports
  const active = props.active
  const sportObject = props.sportObject
  const handleSportClick = props.handleSportClick
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const mobileSportsNavIsOpen = props.mobileSportsNavIsOpen
  const setMobileSportsNavIsOpen = props.setMobileSportsNavIsOpen;

  return (
    <div className="w-full mt-4 p-2 flex-col lg:hidden  overflow-scroll">
      <button
        onClick={() => setMobileSportsNavIsOpen(!mobileSportsNavIsOpen)}
        className={styles.openNav_btn}
      >
          open sports
        </button>
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
                    {sportObject &&
                      sportObject.map((sportsObj, index) => {
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
          </ul>
        )}
      </div>
    );
}

export default MobileNavigation;