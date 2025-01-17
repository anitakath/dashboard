import styles from "./Navigation.module.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
//CUSTOM HOOKS
import { useFontAwesomeIcons } from "@/custom-hooks/FontAwesome/useFontAwesomeIcons";

const WebNavigation = ({deleteSportHandler, sortedNavigationArr,  active,  handleSportClick, formIsOpen, addSportClickHandler}) =>{

  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const fontAwesomeIcons = useFontAwesomeIcons();


  return (
    <div className="w-full ">
      {!formIsOpen && (
        <div className={styles.navigation_web}>
          <ul className="w-full h-full flex lg:flex-col overflow-scroll">
            {sortedNavigationArr.map((sportsObj, index) => (
              <div className="relative" key={index}>
                <li className="flex">
                  <button
                    className={`${styles.sport_btn} ${
                      active === sportsObj.name && selectedSport !== "all"
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handleSportClick(sportsObj.name)}
                  >
                    <button
                      className={styles.delete_btn}
                      onClick={() => deleteSportHandler(sportsObj.name)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={styles.trash_icon}
                      />
                    </button>
                    <span className={styles.sportBtnText}>{sportsObj.name}</span>
                    <div className={styles.circle_div}>
                      <div
                        className={`${styles.circle_background} ${styles[sportsObj.color]}`}
                      ></div>
                      <div className={`${styles[sportsObj.color]} ${styles.circle}`}>
                        {/* Hier wird das Icon gerendert */}
                        {sportsObj.icon && fontAwesomeIcons[sportsObj.icon] && (
                          <FontAwesomeIcon icon={fontAwesomeIcons[sportsObj.icon]} className={styles.icon} />
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              </div>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-center">
      <button className={styles.addSport_btn} onClick={addSportClickHandler}>
        {formIsOpen ? "-" : "+"}
      </button>
      </div>
      
    </div>
  );
};

export default WebNavigation;