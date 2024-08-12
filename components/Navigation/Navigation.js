import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navigation.module.css";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setNavigation,
} from "@/store/sportReducer";

import SortSports from "./SortSports";
import MobileNavigation from "./MobileNavigation";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const alphabetic = allSupabaseSports ? Array.from(new Set(allSupabaseSports.map((sport) => sport.name))).sort((a, b) => a.localeCompare(b)): [];
  const sportObject = useSelector((state) => state.sport.currentSport && state.sport.currentSport.length > 0 ? state.sport.currentSport[0] : null);
  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);
  const navigation = useSelector((state) => state.sport.navigation);
  const selectedSport = useSelector((state) => state.sport.selectedSport);


  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);


  useEffect(()=>{
    setUniqueSports(navigation)

  }, [navigation])


  const handleSportClick = (sport) => {
    setActive(sport);
    dispatch(setSelectedSport(sport));
  };

  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
  };




  const deleteSportHandler = (sport) => {
    if (window.confirm("Are you sure you want to delete?")) {
      // Dispatch delete action here
    }
  };
  


  return (
    <div className="w-full p-0 flex flex-col items-center shadow-section">
      <h1 className={styles.title}>DASHBOARD</h1>
      <h2 className={styles.subtitle}>Your sports</h2>

      <SortSports
        uniqueSports={uniqueSports}
        setUniqueSports={setUniqueSports}
        allSupabaseSports={allSupabaseSports}
      />

      {/*-------------------  MOBILE  NAVIGATION ------------------- */}

      <MobileNavigation
        formisOpen={formIsOpen}
        active={active}
        uniqueSports={uniqueSports}
        handleSportClick={handleSportClick}
        deleteSportHandler={deleteSportHandler}
        sportObject={sportObject}
      />

      {/*-------------------  WEB NAVIGATION ------------------- */}

      {!formIsOpen && (
        <div className={styles.navigation_web}>

          {/* HIER EINE CSS KLASSE HINZUFÜGEN!!! */}
          <button className={styles.showMobileSportsNav_btn}>

            open sports{" "}
          </button>
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
        </div>
      )}

      {formIsOpen && (
        <AddSportForm addSportClickHandler={addSportClickHandler} />
      )}

      <button className={styles.addSport_btn} onClick={addSportClickHandler}>
        {formIsOpen ? "-" : "+"}
      </button>
    </div>
  );
};

export default Navigation;
