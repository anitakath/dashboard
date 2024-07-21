import { useState, useEffect } from "react"
import styles from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
import { setNavigationArray } from "@/store/navigationReducer";

//COMPONENTS
import AddSportForm from "./AddSportForm";
import SortSports from "./SortSports";

const WebNavigation = () =>{
  const [formIsOpen, setFormIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const dispatch = useDispatch();
  //console.log(allSupabaseSports);

  // Erstellen einer Liste mit eindeutigen Sportnamen und Labels
  const uniqueSports = Array.from(
    new Set(
      allSupabaseSports.map((sport) =>
        JSON.stringify({ name: sport.name, label: sport.label })
      )
    )
  ).map(JSON.parse);

  const [navArray, setNavArray] = useState([...uniqueSports]);

  useEffect(() => {
    if (uniqueSports) {
      setNavArray(uniqueSports);
      //dispatch(setNavigationArray(uniqueSports));
    }
  }, []);

  const handleSportClick = (sport) => {
    //set clicked button to active for style change
    setActive(sport);
    // set your collected sport as the sport you are currently working on
    dispatch(setSelectedSport(sport.name));
  };

  const addSportClickHandler = () => {
    setFormIsOpen((prevState) => !prevState);
  };

  //hier sind beim ersten Aufrufen der Seite Objekte im Array
  console.log(uniqueSports);
  //hier sind KEINE Objekte im Array
  console.log(navArray);

  return (
    <div className="w-full p-0 flex flex-col items-center shadow-section relative border-2 ">
      <h1 className={styles.title}>DASHBOARD</h1>
      <h2 className={styles.subtitle}>Your sports</h2>

      <SortSports
        navArray={navArray}
        setNavArray={setNavArray}
        allSupabaseSports={allSupabaseSports}
      />

      <ul className="w-full h-full flex lg:flex-col overflow-scroll">
        {navArray.map((sport, index) => (
          <li className="relative " key={index}>
            <button
              className={`${styles.sport_btn} ${
                active && active.name === sport.name ? styles.active : ""
              }`}
              key={index}
              onClick={() => handleSportClick(sport)}
            >
              {sport.name}
              <div className={styles.circle_div}>
                <div
                  className={`${styles.circle_background} ${
                    styles[sport.label]
                  } `}
                ></div>
                <div
                  className={`${styles[sport.label]} ${styles.circle}`}
                ></div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {formIsOpen && (
        <AddSportForm addSportClickHandler={addSportClickHandler} />
      )}

      <button className={styles.addSport_btn} onClick={addSportClickHandler}>
        {formIsOpen ? "-" : "+"}
      </button>
    </div>
  );
}

export default WebNavigation