import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import styles from "./Navigation.module.css";
import { useDispatch } from "react-redux";
import { setSort } from "@/store/navigationReducer";

const SortSports = ({ uniqueSports, setUniqueSports, allSupabaseSports }) => {
  const dispatch = useDispatch();

  const sortHandler = (criteria) => {
    let sortedSports;

    dispatch(setSort(criteria));

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
          const latestA = Math.max(
            ...allSupabaseSports
              .filter((sport) => sport.name === a)
              .map((item) => new Date(item.created_at))
          );
          const latestB = Math.max(
            ...allSupabaseSports
              .filter((sport) => sport.name === b)
              .map((item) => new Date(item.created_at))
          );
          return latestB - latestA;
        });
        break;
      default:
        sortedSports = [...uniqueSports];
    }

    setUniqueSports(sortedSports);
  };

  return (
    <div className="flex lg:mb-4 items-center relative lg:h-14 ">
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
        <option value="most">Most entries first</option>
        <option value="latest">Latest</option>
      </select>
    </div>
  );
};

export default SortSports;
