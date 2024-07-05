

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navigation.module.css";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setAllSportsFromSupabase,
  setNavigation,
} from "@/store/sportReducer";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);

  const currentSport = useSelector((state) => state.sport.selectedSport);
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );

  const dispatch = useDispatch();

  const alphabetic = allSupabaseSports
    ? Array.from(new Set(allSupabaseSports.map((sport) => sport.name))).sort(
        (a, b) => a.localeCompare(b)
      )
    : [];

  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);

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

  const sortHandler = (criteria) => {
    let sortedSports = [];

    switch (criteria) {
      case "alphabetically":
        sortedSports = [...alphabetic];
        break;
      // Add cases for other sorting criteria here
      default:
        sortedSports = [...alphabetic];
        break;
    }

    setUniqueSports(sortedSports);
  };

  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);

  const deleteSportHandler = (sport) => {
    if (window.confirm("Are you sure you want to delete?")) {
      // Dispatch delete action here
    }
  };

  return (
    <div className="w-full p-0 flex flex-col items-center shadow-section">
      <h1 className={styles.title}>DASHBOARD</h1>
      <h2 className={styles.subtitle}>Your sports</h2>

      <div className="flex w-full mb-4 items-center relative">
        <button
          onClick={() => sortHandler("alphabetically")}
          className={styles.sort}
        >
          <FontAwesomeIcon icon={faSort} />
        </button>

        <select
          className={styles.select_input}
          onChange={(e) => sortHandler(e.target.value)}
        >
          <option value="alphabetically">Alphabetically</option>
          {/* Add more sorting options as needed */}
        </select>
      </div>

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
                    x
                  </button>
                  {sport}
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
