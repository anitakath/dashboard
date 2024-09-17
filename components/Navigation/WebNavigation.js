import { useState, useEffect } from "react"
import styles from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
import { setNavigationArray } from "@/store/navigationReducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//COMPONENTS
import AddSportForm from "./AddSportForm";
import SortSports from "./SortSports";

const WebNavigation = (props) =>{
  const deleteSportHandler = props.deleteSportHandler;
  const uniqueSports = props.uniqueSports;
  const active = props.active;
  const navigationArr = props.navigationArr;
  const handleSportClick = props.handleSportClick;
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const formIsOpen = props.formIsOpen;
  const setFormIsOpen = props.setFormIsOpen;
  const addSportClickHandler = props.addSportClickHandler

  const [sportsNavIsOpen, setSportsNavIsOpen] = useState(false);

  return (
    <div className="w-full">
      {!formIsOpen && (
        <div className={styles.navigation_web}>
          <ul className="w-full h-full flex lg:flex-col overflow-scroll">
            {uniqueSports.map((sport, index) => (
              <div className="relative" key={index}>
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
          </ul>
        </div>
      )}
      <button className={styles.addSport_btn} onClick={addSportClickHandler}>
        {formIsOpen ? "-" : "+"}
      </button>
    </div>
  );
}

export default WebNavigation