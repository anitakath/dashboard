import React, { useReducer, useEffect, useState } from "react";
import Link from "next/link";
//REDUX
import {setNavigation, setSelectedSport, setCurrentSport} from "@/store/sportReducer";
import { useSelector, useDispatch } from "react-redux";
//STYLES
import styles from "./AddSportForm.module.css";
import coloring from '../../styles/Colors.module.css'
import useFetchEntries from "@/custom-hooks/entries/useFetchEntries";
//CUSTOM HOOKS
import useColors from "@/custom-hooks/useColors";

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

const AddSportForm = ({ addSportClickHandler }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const reduxDispatch = useDispatch();
  const navigation = useSelector((state) => state.sport.navigation);
  const sports = useSelector((state) => state.sport.currentSport);
  const allPlannedSports = useSelector((state) => state.sport.allPlannedSports);
  const userId = useSelector((state) => state.auth.userId)
  const [showSportButtons, setShowSportsButton] = useState(false)
  const {fetchAllSportsFromUser} = useFetchEntries()
  const [navigationsArray, setNavigationsArray] = useState([])
  const allSports = useSelector((state) => state.sport)
  const {colors} = useColors();


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

    const data = {
      name: state.name,
      color: state.color,
    };

    reduxDispatch(setNavigation([...navigation, data.name]));
    reduxDispatch(setSelectedSport(data.name));
    reduxDispatch(setCurrentSport([...sports, data]));

    addSportClickHandler();

    // Reset the form
    dispatch({ type: "SET_NAME", payload: "" });
    dispatch({ type: "SET_COLOR", payload: { color: null, style: "" } });
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

  const getAllSports =async () =>{
    //renders all sports + labels user had already been using in the past as buttons, so he can quick choose them
    const navigationsArray = await fetchAllSportsFromUser(userId)

    if(navigationsArray.length > 0){
      setNavigationsArray(navigationsArray)
      setShowSportsButton(prevState => !prevState)
    }
  }

  const handleSportSelect = (sport) => {
    console.log(sport)
    dispatch({ type: "SET_NAME", payload: sport.name });
    dispatch({ type: "SET_COLOR", payload: { color: sport.color, style: sport.color } });
    setError(false, ""); // Setze Fehler zurück

    // Führe die Logik von handleSubmit hier aus
    if (!sport.name) return setError(true, "theres no type of sport!");
    if (sport.color === null || usedColors.has(sport.color))
        return setError(true, "Color is already in use - please choose another one");
    if (navigation.includes(sport.name))
        return setError(true, "You have already added this sport to your diary.");

    const data = {
        name: sport.name,
        color: sport.color,
    };

    reduxDispatch(setNavigation([...navigation, data.name]));
    reduxDispatch(setSelectedSport(data.name));
    reduxDispatch(setCurrentSport([...sports, data]));

    addSportClickHandler();

    // Reset the form
    dispatch({ type: "SET_NAME", payload: "" });
    dispatch({ type: "SET_COLOR", payload: { color: null, style: "" } });
  };


  return (
    <div className="w-full" id="addSportContainer">
    <form className="w-full my-2 p-2 overflow-scroll" onSubmit={handleSubmit}>
      <label className="text-xs hidden"> sport </label>
      <input
        type="text"
        onChange={(e) =>
          dispatch({ type: "SET_NAME", payload: e.target.value })
        }
        placeholder="enter your sport..."
        className={styles.input}
      />

     <div className="flex-col items-center justify-center">
        <h2 className="mx-2">Choose a label or</h2>
        <button onClick={getAllSports} className="secondary_button" > 
        {showSportButtons ? 'Create a new sport + label' : 'Get all sports ever done'}
       </button>
      </div>


    {showSportButtons && (
      <div>
                {navigationsArray.map((sport, index) => {
                    if (!sport || !sport.name || !sport.color) {
                        return null; 
                    }
                    const color = sport.color;
                    
                    const isColorUsed = allSports.currentSport.some(nav => nav.color === color);

                    return (
                        <div key={index} className="m-2 relative">
                            <button
                                className={`${styles[color]} w-full  p-1 flex justify-start`}
                                onClick={() => handleSportSelect(sport)} 
                            >
                                {sport.name}
                            </button> 
                            
                            {isColorUsed && (
                              <div className={styles.overlay}>
                                  <h2 className={styles.text}>Already in use</h2> {/* Dunkelschwarzer Text */}
                              </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
         
         {!showSportButtons && (
           <div className={styles.colors_div}>
           {colors.map((color) => (
             <button
               key={color}
               type="button"
               className={`${styles.colors} ${coloring[color]} ${
                 color === state.selectedSportStyle ? styles.selectedSport : ""
               }`}
               onClick={() => colorLabelHandler(color)}
             >
               {usedColors.has(color) && "❌"}
             </button>
           ))}
         </div>
         )}

      <p className="my-6">{state.errorMessage}</p>
      <Link href="/profile" className={styles.link}>
        go to your profile
      </Link>

      <button type="submit" className={styles.add_btn}>
        Add Sport
      </button>
     
    </form>


   
    </div>
  );
};

export default AddSportForm;
