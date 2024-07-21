

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navigation.module.css";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setAllSportsFromSupabase,
  setNavigation,
  setLabel
} from "@/store/sportReducer";

import SortSports from "./SortSports";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
  //fetch all objects from supabase
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const alphabetic = allSupabaseSports ? Array.from(new Set(allSupabaseSports.map((sport) => sport.name))).sort((a, b) => a.localeCompare(b)): [];
  const sportObject = useSelector((state) => state.sport.currentSport && state.sport.currentSport.length > 0 ? state.sport.currentSport[0] : null);
  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);
  const currentSport = useSelector((state) => state.sport.currentSport);
  const navigation = useSelector((state) => state.sport.navigation);
  const sportReducer = useSelector((state) => state.sport);


  


 const uniqueLabels = allSupabaseSports
   ? allSupabaseSports.reduce((acc, sport) => {
       if (!acc[sport.name]) {
         acc[sport.name] = sport.label;
       }
       return acc;
     }, {})
   : {};


  

  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);




  useEffect(()=>{
    setUniqueSports(navigation)

  }, [navigation])





  useEffect(() => {
    dispatch(setAllSportsFromSupabase([])); // Initial empty array
    fetchSportsData();
  }, []);

  const fetchSportsData = async () => {
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) {
        throw new Error("Failed to fetch sports data");
      }
      const data = await response.json();
      dispatch(setAllSportsFromSupabase(data.data));
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
  };

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

      {!formIsOpen && (
        <ul className="w-full h-full flex lg:flex-col overflow-scroll">
          {uniqueSports.map((sport, index) => (
            <div className="relative" key={index}>
              <li key={index} className="flex">
                <button
                  className={`${styles.sport_btn} ${
                    active === sport ? styles.active : ""
                  }`}
                  onClick={() => handleSportClick(sport)}
                >
                  <button
                    className={styles.delete_btn}
                    onClick={() => deleteSportHandler(sport)}
                  >
                    <FontAwesomeIcon icon={faTrash} className={styles.trash_icon}/>
                  </button>
                  <span className={styles.sportBtnText}>{sport}</span>
                  {sportObject &&
                    sportObject.map((sportsObj) => {
                      if (sportsObj.name === sport) {
                        return (
                          <div className={styles.circle_div}>
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
