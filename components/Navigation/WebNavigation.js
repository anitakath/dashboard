import styles from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//COMPONENTS

//CUSTOM HOOKS
import { useFontAwesomeIcons } from "@/custom-hooks/FontAwesome/useFontAwesomeIcons";

const WebNavigation = ({deleteSportHandler, uniqueSports, active, navigationArr, handleSportClick, formIsOpen, setFormIsOpen, addSportClickHandler}) =>{

  const selectedSport = useSelector((state) => state.sport.selectedSport);
  // Verwenden des Hooks, um die Icons zu erhalten
  const fontAwesomeIcons = useFontAwesomeIcons();


  return (
    <div className="w-full ">
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
                              >
                                {/* Hier wird das Icon gerendert */}
                                {sportsObj.icon &&
                                  fontAwesomeIcons[sportsObj.icon] && (
                                    <FontAwesomeIcon
                                      icon={fontAwesomeIcons[sportsObj.icon]}
                                      className={styles.icon}
                                      
                                    />
                                  )}
                           
                              </div>
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