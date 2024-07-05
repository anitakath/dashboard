
import React, { useState } from "react";
import Link from "next/link";

//REDUX

import { setNavigation, setSelectedSport, setCurrentSport } from "@/store/sportReducer";
import { useSelector, useDispatch } from "react-redux";


//SUPABASE
import { supabase } from "@/services/supabaseClient";

//STYLES
import styles from './AddSportForm.module.css'



const AddSportForm = (props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [color, setColor] = useState(null);
  const dispatch = useDispatch();
  const navigation = useSelector((state) => state.sport.navigation);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, color };

    if (navigation.includes(name)) {
      setError(true);
      return;
    } else {
      console.log("updating navigation");
      setError(false);
      const updated = [...navigation, data];
      dispatch(setNavigation(updated));

      dispatch(setSelectedSport(name));
      dispatch(setCurrentSport({ name, color }));
      props.addSportClickHandler();
    }
  };

  const colorLabelHandler = (selectedColor) => {


    console.log(selectedColor)
    setColor(selectedColor);
  };

  console.log(color)
  console.log(name)

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
    "paleDogwood",
    "brown",
    "jasmine",
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
