import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import styles from "./Navigation.module.css";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setNavigation,
} from "@/store/sportReducer";

import SortSports from "./SortSports";
import MobileNavigation from "./MobileNavigation";
import WebNavigation from "./WebNavigation";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const alphabetic = allSupabaseSports ? Array.from(new Set(allSupabaseSports.map((sport) => sport.name))).sort((a, b) => a.localeCompare(b)): [];
  const sportObject = useSelector((state) => state.sport.currentSport && state.sport.currentSport.length > 0 ? state.sport.currentSport[0] : null);
  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);
  const navigation = useSelector((state) => state.sport.navigation);
  const [mobileSportsNavIsOpen, setMobileSportsNavIsOpen] = useState(false);


  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);


  useEffect(()=>{
    setUniqueSports(navigation)

  }, [navigation])


  const handleSportClick = (sport) => {
    setActive(sport);
    setMobileSportsNavIsOpen(false)
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
        mobileSportsNavIsOpen={mobileSportsNavIsOpen}
        setMobileSportsNavIsOpen={setMobileSportsNavIsOpen}
        
      />

      {/*-------------------  WEB NAVIGATION ------------------- */}

      <WebNavigation
        formisOpen={formIsOpen}
        active={active}
        uniqueSports={uniqueSports}
        handleSportClick={handleSportClick}
        deleteSportHandler={deleteSportHandler}
        sportObject={sportObject}
      />

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
