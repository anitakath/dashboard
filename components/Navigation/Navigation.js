import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import styles from "./Navigation.module.css";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setNavigation,
} from "@/store/sportReducer";
import { setAllSportsFromSupabase } from "@/store/sportReducer";

import SortSports from "./SortSports";
import MobileNavigation from "./MobileNavigation";
import WebNavigation from "./WebNavigation";
import AddSportAlert from "../UI/AddSportAlert";
import { supabase } from "@/services/supabaseClient";
//CUSTOM HOOKS


const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const userId = useSelector((state) => state.auth.userId);
  // Erstelle navigationArr basierend auf allSupabaseSports
  const navigationArr = allSupabaseSports
    ? allSupabaseSports
        .filter((sport) => sport.userId === userId) // Filtere nach userId
        .map((sport) => ({
          name: sport.name,
          color: sport.label, // Hier wird angenommen, dass 'label' die Farbe ist
          icon: sport.icon
        }))
        .reduce((accumulator, current) => {
          // Überprüfe, ob der Name bereits im Akkumulator vorhanden ist
          if (!accumulator.some((item) => item.name === current.name)) {
            accumulator.push(current); // Füge das aktuelle Element hinzu
          }
          return accumulator;
        }, [])
  : [];

  const alphabetic = allSupabaseSports
    ? Array.from(new Set(navigationArr.map((sport) => sport.name))).sort(
        (a, b) => a.localeCompare(b)
      )
  : [];


  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);
  const navigation = useSelector((state) => state.sport.navigation);
  const [mobileSportsNavIsOpen, setMobileSportsNavIsOpen] = useState(false);
  const showAlert = useSelector((state) => state.sport.showAlert);
  const currentSport = useSelector((state) => state.sport.currentSport)


  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);

  useEffect(() => {
    setUniqueSports(navigation);
  }, [navigation, allSupabaseSports]);

  const handleSportClick = (sport) => {
    setActive(sport);
    setMobileSportsNavIsOpen(false);
    dispatch(setSelectedSport(sport));
  };

  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
  };


  const deleteSportHandler = (sport) => {
    // Zeige das Bestätigungsfenster an
    if (window.confirm(`Are you sure you want to delete “${sport}”? All entries will be lost`)) {
      // Remove the sports object from navigationArr
      const updatedNavigationArr = navigationArr.filter(
        (item) => item.name !== sport
      );

      //console.log(updatedNavigationArr);
      const uniqueSports = updatedNavigationArr
        ? Array.from(
            new Set(updatedNavigationArr.map((sport) => sport.name))
          ).sort((a, b) => a.localeCompare(b))
        : [];

      //console.log(uniqueSports);
      dispatch(setNavigation(uniqueSports));
      // Hier solltest du deine Supabase-Logik zum Löschen implementieren
      const deleteSportsFromSupabase = async () => {
        try {
          const { data, error } = await supabase
            .from("sports")
            .delete()
            .match({ name: sport, userId: userId });

          if (error) throw error;

          console.log(`Erfolgreich gelöscht: ${data}`);

          // Aktualisiere allSupabaseSports im Redux-Store
          const updatedAllSupabaseSports = allSupabaseSports.filter(
            (item) => !(item.name === sport && item.userId === userId)
          );

          //console.log(updatedAllSupabaseSports);

          dispatch(setAllSportsFromSupabase(updatedAllSupabaseSports));
        } catch (error) {
          console.error("Fehler beim Löschen:", error);
        }
      };

      deleteSportsFromSupabase();
    }
  };

  //console.log(currentSport);
  //console.log(navigationArr)

  

  return (
    <div className="w-full relative my-4 p-0 flex flex-col items-center shadow-section">
      <h1 className="title title_maxi">DASHBOARD</h1>

      <h2 className="subtitle">Your sports</h2>

      <div className="hidden lg:inline">
        <SortSports
          uniqueSports={uniqueSports}
          setUniqueSports={setUniqueSports}
          allSupabaseSports={allSupabaseSports}
        />
      </div>

      {/*-------------------  MOBILE  NAVIGATION ------------------- */}

      <MobileNavigation
        formIsOpen={formIsOpen}
        setFormIsOpen={setFormIsOpen}
        active={active}
        uniqueSports={uniqueSports}
        handleSportClick={handleSportClick}
        deleteSportHandler={deleteSportHandler}
        navigationArr={navigationArr}
        mobileSportsNavIsOpen={mobileSportsNavIsOpen}
        setMobileSportsNavIsOpen={setMobileSportsNavIsOpen}
        setUniqueSports={setUniqueSports}
        allSupabaseSports={allSupabaseSports}
        addSportClickHandler={addSportClickHandler}
      />

      {/*-------------------  WEB NAVIGATION ------------------- */}

      {showAlert && <AddSportAlert />}
      <WebNavigation
        formisOpen={formIsOpen}
        setFormIsOpen={setFormIsOpen}
        addSportClickHandler={addSportClickHandler}
        active={active}
        uniqueSports={uniqueSports}
        handleSportClick={handleSportClick}
        deleteSportHandler={deleteSportHandler}
        navigationArr={navigationArr}
      />

      {formIsOpen && (
        <AddSportForm addSportClickHandler={addSportClickHandler} />
      )}

      {/*
      <button className={styles.addSport_btn} onClick={addSportClickHandler}>
        {formIsOpen ? "-" : "+"}
      </button>*/}
    </div>
  );
};

export default Navigation;
