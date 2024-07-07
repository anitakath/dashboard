import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";

import { setSort } from "@/store/navigationReducer";

const SortSports = (props) => {


    const uniqueSports = props.uniqueSports;
    const setUniqueSports = props.setUniqueSports;
    const allSupabaseSports = props.allSupabaseSports;
    const selectedSport = useSelector((state) => state.sport.selectedSport);


    const dispatch = useDispatch();

    const currentSort = useSelector((state) => state.navigation.sort);
    //console.log(currentSort)



  const sortHandler = (criteria) => {
    let sortedSports = [];


    dispatch(setSort(criteria))


    switch (criteria) {
      case "alphabetically":
        sortedSports = [...uniqueSports].sort((a, b) => a.localeCompare(b));
        break;
      case "most":
        sortedSports = [...uniqueSports].sort((a, b) => {
          const countA = allSupabaseSports.filter(
            (sport) => sport.name === a
          ).length;
          const countB = allSupabaseSports.filter(
            (sport) => sport.name === b
          ).length;
          return countB - countA;
        });
        break;
      case "latest":
        sortedSports = [...uniqueSports].sort((a, b) => {
          const latestA = allSupabaseSports
            .filter((sport) => sport.name === a)
            .map((item) => new Date(item.created_at))
            .sort((date1, date2) => date2 - date1)[0];
          const latestB = allSupabaseSports
            .filter((sport) => sport.name === b)
            .map((item) => new Date(item.created_at))
            .sort((date1, date2) => date2 - date1)[0];
          return latestB - latestA;
        });
        break;

      // Add cases for other sorting criteria here
      default:
        sortedSports = [...uniqueSports];
        break;
    }

    setUniqueSports(sortedSports);
  };
  /*

  useEffect(()=>{
      console.log(
        "why is the selected sorting not saved using redux persist? with refresh we are back to alphabetically. i would like to keep most entries after a refresh if this is clicked on"
      );
      sortHandler(currentSort);

  }, [allSupabaseSports])*/

  //console.log(currentSort)

  return (
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
        <option value="most"> most entries first</option>
        <option value="latest">latest</option>

      </select>
    </div>
  );
};

export default SortSports;
