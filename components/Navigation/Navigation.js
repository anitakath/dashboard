import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setNavigation,
} from "@/store/sportReducer";
import SortSports from "./SortSports";
import MobileNavigation from "./MobileNavigation";
import WebNavigation from "./WebNavigation";
import AddSportAlert from "../UI/AddSportAlert";
//CUSTOM HOOKS
import useFilterAndSortEntries from "@/custom-hooks/entries/useFilterAndSortEntries";
import { setFilteredEntriesByCurrentSport } from "@/store/sportReducer";
import useDeleteSport from "@/custom-hooks/sports/useDeleteSport";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const userId = useSelector((state) => state.auth.userId);
 

  const navigationArr = allSupabaseSports ? allSupabaseSports
    .filter((sport) => sport.userId === userId)
    .map((sport) => ({
      name: sport.name,
      color: sport.label,
    }))
    .reduce((accumulator, current) => {
      if (!accumulator.some((item) => item.name === current.name)) {
        accumulator.push(current);
      }
      return accumulator;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name)) // Alphabetische Sortierung hier hinzufügen
  : [];


  const [sortedNavigationArr, setSortedNavigationArr] = useState(navigationArr);


  useEffect(() => {
    setSortedNavigationArr(navigationArr);
  }, [allSupabaseSports]);



  const { filterEntriesByCurrentSport} = useFilterAndSortEntries();
  const [mobileSportsNavIsOpen, setMobileSportsNavIsOpen] = useState(false);
  const showAlert = useSelector((state) => state.sport.showAlert);
  const selectedSport = useSelector((state) => state.sport.selectedSport);

  useEffect(() => {
    const getEntries = async () => {
      const entries = await filterEntriesByCurrentSport(
        allSupabaseSports,
        selectedSport,
      );
      dispatch(setFilteredEntriesByCurrentSport(entries.filterEntries));
    };

      getEntries();
  }, [selectedSport]);





  const handleSportClick = (sport) => {
    //filterEntriesByCurrentSport(allSupabaseSports, sport)
    setActive(sport);
    setMobileSportsNavIsOpen(false);
    dispatch(setSelectedSport(sport));
  };

  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
  };

  const { deleteSportHandler } = useDeleteSport();



  


  return (
    <div className="w-full relative  lg:my-4 p-0 flex flex-col items-center shadow-section">
      <h1 className="title title_maxi">DASHBOARD</h1>

      <div className="hidden lg:inline">
        <SortSports
          sortedNavigationArr={sortedNavigationArr}
          setSortedNavigationArr={setSortedNavigationArr}
          allSupabaseSports={allSupabaseSports}
        />
      </div>

      {/*-------------------  MOBILE  NAVIGATION ------------------- */}



      <MobileNavigation
        formIsOpen={formIsOpen}
        setFormIsOpen={setFormIsOpen}
        active={active}
        handleSportClick={handleSportClick}
        deleteSportHandler={deleteSportHandler}



        navigationArr={navigationArr}
        sortedNavigationArr={sortedNavigationArr}
        setSortedNavigationArr={setSortedNavigationArr}
        mobileSportsNavIsOpen={mobileSportsNavIsOpen}
        setMobileSportsNavIsOpen={setMobileSportsNavIsOpen}
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
        handleSportClick={handleSportClick}
        deleteSportHandler={deleteSportHandler}



        navigationArr={navigationArr}
        sortedNavigationArr={sortedNavigationArr}
        setSortedNavigationArr={setSortedNavigationArr}
      />

      {formIsOpen && (
        <AddSportForm addSportClickHandler={addSportClickHandler} />
      )}

    </div>
  );
};

export default Navigation;
