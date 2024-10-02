
import React, { useReducer } from "react";
import Link from "next/link";
//REDUX
import { setNavigation, setSelectedSport, setCurrentSport } from "@/store/sportReducer";
import { useSelector, useDispatch } from "react-redux";
//STYLES
import styles from './AddSportForm.module.css'
//FONTAWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketballBall, faFootballBall, faBaseballBall, faTennisBall, faVolleyballBall } from '@fortawesome/free-solid-svg-icons';



const initialState = {
  name: "",
  error: false,
  errorMessage: "",
  color: null,
  selectedSportStyle: "",
  selectedIcon: null
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
    case "SET_ICON":
      return {
        ...state,
        selectedIcon: action.payload,
      };
    default:
      return state;
  }
};

const AddSportForm = ({addSportClickHandler}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();
  const navigation = useSelector((state) => state.sport.navigation);
  const sports = useSelector((state) => state.sport.currentSport[0]);
  const allPlannedSports = useSelector((state) => state.sport.allPlannedSports);

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

  const usedColors = new Set([
    ...(sports ? sports.map((sport) => sport.color) : []),
    ...(allPlannedSports ? allPlannedSports.map((sport) => sport.label) : []),
  ]);

  const setError = (error, message) => {
    dispatch({ type: "SET_ERROR", payload: { error, message } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name) return setError(true, "please enter a type of sport!");
    if (state.color === null || usedColors.has(state.color))
      return setError(
        true,
        "Color is already in use - please choose another one"
      );
    if (navigation.includes(state.name))
      return setError(true, "You have already added this sport to your diary.");
    //if (!state.selectedIcon) return setError(true, "Please select an icon for the sport!");

    const data = {
      name: state.name,
      color: state.color,
      icon: state.selectedIcon,
    };
    //console.log(data)

    reduxDispatch(setNavigation([...navigation, data.name]));
    reduxDispatch(setSelectedSport(data.name));
    reduxDispatch(setCurrentSport([...sports, data]));

    addSportClickHandler();

    // Reset the form
    dispatch({ type: "SET_NAME", payload: "" });
    dispatch({ type: "SET_COLOR", payload: { color: null, style: "" } });
    dispatch({ type: "SET_ICON", payload: null }); // Reset selected icon
  };

  const colorLabelHandler = (selectedColor) => {
    if (usedColors.has(selectedColor)) {
      setError(true, "Color is already in use - please choose another one");
    } else {
      dispatch({
        type: "SET_COLOR",
        payload: { color: selectedColor, style: selectedColor },
      });
      setError(false, "");
    }
  };

  // Liste der Sport-Icons// Liste der Sport-Icons
  const sportsIcons = [
    { icon: faBasketballBall },
    { icon: faFootballBall },
    { icon: faBaseballBall },
    { icon: faTennisBall },
    { icon: faVolleyballBall },
    // Füge hier weitere Icons hinzu...
  ];
  /*
  const sportsIcons = [
    { icon: faBasketballBall, label: "Basketball" },
    { icon: faFootballBall, label: "Football" },
    { icon: faBaseballBall, label: "Baseball" },
    { icon: faTennisBall, label: "Tennis" },
    { icon: faVolleyballBall, label: "Volleyball" },
    // Füge hier weitere Icons hinzu...
  ];*/
   const selectIconHandler = (icon) => {
     dispatch({ type: "SET_ICON", payload: icon });
     setError(false, ""); // Reset any previous errors related to icon selection
   };

  console.log(state)

  return (
    <form className="w-full my-2 p-2 overflow-scroll" onSubmit={handleSubmit}>
      <label className="text-xl hidden">Type</label>
      <input
        type="text"
        onChange={(e) =>
          dispatch({ type: "SET_NAME", payload: e.target.value })
        }
        placeholder="enter type of sport..."
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

      <label>
        <em>soon available:</em> <br/> give it an icon
      </label>
      <div className={styles.icons_div}>
        {sportsIcons.map(({ icon }, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.icon_button} ${
              state.selectedIcon === icon ? styles.selectedIcon : ""
            }`}
            onClick={() => selectIconHandler(icon)}
          >
            <FontAwesomeIcon icon={icon} size="2x" />
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
