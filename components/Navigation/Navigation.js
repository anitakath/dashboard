import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import AddSportForm from "./AddSportForm";
import {
  setSelectedSport,
  setCurrentSport,
} from "@/store/sportReducer";
import SortSports from "./SortSports";
import MobileNavigation from "./MobileNavigation";
import WebNavigation from "./WebNavigation";
import AddSportAlert from "../UI/AddSportAlert";
//CUSTOM HOOKS
import useFilterAndSortEntries from "@/custom-hooks/entries/useFilterAndSortEntries";
import { setFilteredEntriesByCurrentSportAndDate } from "@/store/sportReducer";
import useDeleteSport from "@/custom-hooks/sports/useDeleteSport";

const Navigation = () => {
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const dispatch = useDispatch();
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const userId = useSelector((state) => state.auth.userId);
  const calendar =  useSelector((state) => state.calendar);
  //const sortedNavigationArray = useNavigation(userId);
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
  const { getFilteredEntriesByCurrentSportAndDate } = useFilterAndSortEntries();
  const [mobileSportsNavIsOpen, setMobileSportsNavIsOpen] = useState(false);
  const showAlert = useSelector((state) => state.sport.showAlert);
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const { deleteSportHandler } = useDeleteSport();
 


  useEffect(() => {
    setSortedNavigationArr(navigationArr);
    setCurrentSport(navigationArr)
  }, [allSupabaseSports]);




  useEffect(() => {
    const getEntries = async () => {
      const entries = await getFilteredEntriesByCurrentSportAndDate(
        allSupabaseSports,
        selectedSport,
        calendar
      );
      dispatch(setFilteredEntriesByCurrentSportAndDate(entries.filterEntries));
    };

      getEntries();
  }, []);



  const handleSportClick = (sport) => {
    //filterEntriesByCurrentSport(allSupabaseSports, sport)
    setActive(sport);
    setMobileSportsNavIsOpen(false);
    dispatch(setSelectedSport(sport));
  };

  
  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
   
  };



  useEffect(() => {
    if (formIsOpen) {
      const element = document.getElementById('addSportContainer');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [formIsOpen]); 




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
