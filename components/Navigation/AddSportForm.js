
import React, { useState, useReducer } from "react";
import Link from "next/link";
//REDUX
import { setNavigation, setSelectedSport, setCurrentSport } from "@/store/sportReducer";
import { useSelector, useDispatch } from "react-redux";
//STYLES
import styles from './AddSportForm.module.css'


const initialState = {
  name: "",
  error: false,
  errorMessage: "",
  color: null,
  selectedSportStyle: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_COLOR":
      return {
        ...state,
        color: action.payload.color,
        selectedSportStyle: action.payload.style,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
};

const AddSportForm = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();

  const navigation = useSelector((state) => state.sport.navigation);
  const sports = useSelector((state) => state.sport.currentSport[0]);

  const allPlannedSports = useSelector(
    (state) => state.sport.allPlannedSports
  );


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
    "mustard",
    "frenchGrey",
    "eggplant",
    "mossGreen",
  ];

  //const usedColors = new Set(sports.map((sport) => sport.color));
  const usedColors = new Set([
    ...sports.map((sport) => sport.color),
    ...allPlannedSports.map((sport) => sport.label), // Hier fügen wir die Labels hinzu
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name) {
      dispatch({
        type: "SET_ERROR",
        payload: { error: true, message: "please enter a type of sport!" },
      });
      return;
    }

    if (state.color === null || usedColors.has(state.color)) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          error: true,
          message: "Color is already in use - please choose another one",
        },
      });
      return;
    }

    if (navigation.includes(state.name)) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          error: true,
          message: "You have already added this sport to your diary.",
        },
      });
      return;
    }

    const data = { name: state.name, color: state.color };

    reduxDispatch(setNavigation([...navigation, data.name]));
    reduxDispatch(setSelectedSport(data.name));
    reduxDispatch(setCurrentSport([...sports, data]));

    props.addSportClickHandler();

    // Reset the form
    dispatch({ type: "SET_NAME", payload: "" });
    dispatch({ type: "SET_COLOR", payload: { color: null, style: "" } });
  };

  const colorLabelHandler = (selectedColor) => {
    if (usedColors.has(selectedColor)) {
      dispatch({
        type: "SET_ERROR",
        payload: {
          error: true,
          message: "Color is already in use - please choose another one",
        },
      });
    } else {
      dispatch({
        type: "SET_COLOR",
        payload: { color: selectedColor, style: selectedColor },
      });
      dispatch({ type: "SET_ERROR", payload: { error: false, message: "" } });
    }
  };


  return (
    <form className="w-full my-2 p-2 overflow-scroll" onSubmit={handleSubmit}>
      <label className="text-xl hidden">Type</label>
      <input
        type="text"
        onChange={(e) =>
          dispatch({ type: "SET_NAME", payload: e.target.value })
        }
        placeholder="type of sport..."
        className={styles.input}
      />

      <label>Choose a label</label>
      <div className={styles.colors_div}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.colors} ${styles[color]} ${
              color === state.selectedSportStyle ? styles.selectedSport : ""
            }`}
            onClick={() => colorLabelHandler(color)}
          >
            {usedColors.has(color) && "❌"}
          </button>
        ))}
      </div>

      <p className="my-6">{state.errorMessage}</p>

      <Link href="/profile" className={styles.link}>
        go to your profile
      </Link>

      <button type="submit" className={styles.add_btn}>
        Add Sport
      </button>
    </form>
  );
};

export default AddSportForm;
