
import React, { useState } from "react";
import Link from "next/link";

//REDUX
import { setNavigation, setSelectedSport, setCurrentSport } from "@/store/sportReducer";

import { useSelector, useDispatch } from "react-redux";

//STYLES
import styles from './AddSportForm.module.css'



const AddSportForm = (props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [color, setColor] = useState(null);
  const dispatch = useDispatch();

  const navigation = useSelector((state) => state.sport.navigation);
  const sports = useSelector((state) => state.sport.currentSport[0])

  console.log(sports)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, color };
    console.log(data)

    if (navigation.includes(name)) {
      setError(true);
      return;
    } else {
      setError(false);
      const updated = [...navigation, data.name];

      // Push data object into the existing sports array
      const updatedSports = [...sports, data];
      console.log(updatedSports);

      dispatch(setNavigation(updated));
      dispatch(setSelectedSport(data.name));
      
      dispatch(setCurrentSport(updatedSports));

      props.addSportClickHandler();
    }
  };

  const colorLabelHandler = (selectedColor) => {
    setColor(selectedColor);
  };

  console.log(color)


  // Array mit Farben für die Buttons
  const colors = [
    "fandango",
    "celeste",
    "springGreen",
    "sinopia",
    "lightOrange",
    "wenge",
    "spaceCadet",
    "mauve",
    "aquamarine",
    "mandarine",
    "brown",
    "jasmine",
    "mustard"
  ];


  return (
    <form className="w-full my-2 p-2" onSubmit={handleSubmit}>
      <label className="text-xl">Type</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      ></input>

      <label>Choose a label</label>
      <div className={styles.colors_div}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.colors} ${styles[color]}`}
            onClick={() => colorLabelHandler(color)}
          >
            ABC
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600s">
          You have already added this sport to your diary. Navigate to your
          profile
          <Link href="/profile" className={styles.link}>
            here
          </Link>
          to get an overview of your sports.
        </p>
      )}

      {!error && (
        <button type="submit" className={styles.add_btn}>
          Add Sport
        </button>
      )}
    </form>
  );
};

export default AddSportForm;
