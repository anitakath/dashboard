

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
  setLabel
} from "@/store/sportReducer";

import SortSports from "./SortSports";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);

  //fetch all objects from supabase
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const alphabetic = allSupabaseSports ? Array.from(new Set(allSupabaseSports.map((sport) => sport.name))).sort((a, b) => a.localeCompare(b)): [];
  
  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);



  /*
  useEffect(() => {
    if (allSupabaseSports) {
      const uniqueLabels = {};
      allSupabaseSports.forEach((sport) => {
        if (!uniqueLabels[sport.name]) {
          uniqueLabels[sport.name] = sport.label;
        }
      });

      const labelsArray = Object.keys(uniqueLabels).map((name) => ({
        name,
        label: uniqueLabels[name],
      }));
      setLabel(labelsArray);
     
    }
  }, [allSupabaseSports]);
  */
 const uniqueLabels = allSupabaseSports
   ? allSupabaseSports.reduce((acc, sport) => {
       if (!acc[sport.name]) {
         acc[sport.name] = sport.label;
       }
       return acc;
     }, {})
   : {};


   /*

 const labelsArray = Object.keys(uniqueLabels).map((name) => ({
   name,
   label: uniqueLabels[name],
 }));

 console.log(uniqueLabels)
 console.log(labelsArray)
 //setLabel(labelsArray);

  const [label, setLabel] = useState([...labelsArray]);

  
 useEffect(()=>{
   dispatch(setLabel(label))

 }, [label])*/


  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);



  const navigation = useSelector((state) => state.sport.navigation)



  const sportReducer = useSelector((state) => state.sport)


  useEffect(()=>{
    setUniqueSports(navigation)

  }, [navigation])



  const dispatch = useDispatch();





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

      {/*
      <div className="flex w-full mb-4 items-center relative border-4">
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
        
        </select>
      </div> 
      */}

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
