import {useEffect, useState} from 'react'

//STYLES
import styles from './Navigation.module.css'

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport, setAllSports, setAllSportsFromSupabase, setNavigation } from "@/store/sportReducer";

//COMPONENTS
import AddSportForm from './AddSportForm';

//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';


const Navigation = ()=> {
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
    : " ";

  const [uniqueSports, setUniqueSports] = useState([...alphabetic]);

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

  useEffect(() => {
    fetchSportsData();
  }, []);

  const handleSportClick = (sport) => {
    setActive(sport);
    dispatch(setSelectedSport(sport));
  };

  useEffect(() => {
    setActive(currentSport);
  }, [currentSport]);

  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
  };

  let addBtn_text = formIsOpen ? "-" : "+";

  const sortHandler = (criteria) => {
    let sortedSports = [];

    switch (criteria) {
      case "alphabetically":
        sortedSports = [...alphabetic];
        break;
      case "recentlyAddedFirst":
        sortedSports = Array.from(
          new Set(allSupabaseSports.map((sport) => sport.name))
        );
        break;
      case "recentlyAddedLast":
        sortedSports = Array.from(
          new Set(allSupabaseSports.map((sport) => sport.name))
        ).reverse();
        break;
      case "mostEntries":
        const countMap = {};

        allSupabaseSports.forEach((sport) => {
          if (!countMap[sport.name]) {
            countMap[sport.name] = 1;
          } else {
            countMap[sport.name]++;
          }
        });

        const sorted = Object.entries(countMap).sort((a, b) => {
          if (b[1] !== a[1]) {
            return b[1] - a[1];
          } else {
            return a[0].localeCompare(b[0]);
          }
        });

        sortedSports = sorted.map((sport) => `${sport[0]} (${sport[1]})`);
        break;
      default:
        // Default alphabetiscch
        sortedSports = [...alphabetic];
    }

    setUniqueSports(sortedSports);
  };

  useEffect(() => {
    dispatch(setNavigation(uniqueSports));
  }, [uniqueSports]);

  const navigation = useSelector((state) => state.sport.navigation);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteSportHandler = (sport) => {
    console.log("deleting");

    // ADD HERE AN "ARE YOU SURE?!?!?!?" BEFORE DELETING THE SPORT!!!!
    alert("are you sure you want to delete?");
    //dispatch(deleteSport(sport));
  };



  return (

    <div className="border-r w-full p-0 flex flex-col items-center shadow-section">
      <h1 className={styles.title}> DASHBOARD </h1>
      <h2 className={styles.subtitle}> your sports </h2>

      <div className="flex w-full  mb-4 items-center relative">
        <button onClick={sortHandler} className={styles.sort}>
          <FontAwesomeIcon icon={faSort} />
        </button>

        <select
          className={styles.select_input}
          onChange={(e) => sortHandler(e.target.value)}
        >
          <option value="alphabetically"> alphabetically </option>
          <option value="recentlyAddedFirst"> recently added first </option>
          <option value="recentlyAddedLast"> recently added last </option>
          <option value="mostEntries"> most entries </option>
        </select>
      </div>

      {!formIsOpen && (
        <ul className="w-full h-full flex lg:flex-col overflow-scroll">
          {navigation &&
            navigation.map((sport, index) => (
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
        {addBtn_text}
      </button>
    </div>
  );
}

export default Navigation