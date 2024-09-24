import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//STYLES
import styles from "./AddEntryForm.module.css";
//REDUX
import { useSelector, useDispatch } from "react-redux";
//SUPABASE
import { supabase } from "@/services/supabaseClient";
//CUSTOM HOOKS
import { useSubmitHandler } from "@/custom-hooks/useSportEntries";
import { useChangeHandler } from "@/custom-hooks/useSportEntries";
import useFormValidation from "@/custom-hooks/validation/useFormValidation";

import {
  validateTitle,
  validateText,
  validateDuration,
  formatText,
} from "@/custom-hooks/validation/validation";
//COMPONENTS
import Spinner from "../UI/Spinner";


const AddEntryForm = (props) => {

  const userId = useSelector((state) => state.auth.userId)
  const router = useRouter();
  const setFormIsOpen = props.setFormIsOpen;
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const currentSport = useSelector((state) => state.sport.currentSport);
  const currentPath = router.pathname;
  const chosenSport = props.chosenSport;
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  let label = "";
  const [isTouched, setIsTouched] = useState({ title: false, text: false });
  const [inputs, setInputs] = useState({
    name: selectedSport,
    title: "",
    text: "",
    created_at: "",
    duration: "",
    label: label,
    userId: userId,
    img: "",
  });

  
  /* ------------ ADD A SPORT HANDLER --------------- */
  const {
    submitHandler,
    successMessage,
    durationErrorMessage,
    errorMessage,
    submitting,
    formIsOpen,
  } = useSubmitHandler(currentPath, chosenSport, inputs);


  useEffect(()=>{
    if (!formIsOpen && currentPath != "/profile") {
      setFormIsOpen(false);
    }
  }, [formIsOpen])

  
  if (selectedSport) {
    const foundSport = allSupabaseSports.find(
      (sport) => sport.name === selectedSport
    );
    if (foundSport) {
      label = foundSport.label;
    } else {
      //console.log(`Kein Sport mit dem Namen ${selectedSport} gefunden`);
    }
  }



  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });

    // Hier kannst du auch die Validierung aufrufen und den Zustand entsprechend setzen
    if (name === "title") {
      if (!validateTitle(value)) {
        console.log("Titel ist ungültig");
      }
    }
    if (name === "text") {
      if (!validateText(value)) {
        console.log("Text ist ungültig");
      }
    }
    if (name === "duration") {
      if (!validateDuration(value)) {
        console.log("Dauer ist ungültig");
      }
    }
  };

  



  const blurHandler = (target) => {
    setIsTouched(true);
    setIsTouched({ ...isTouched, [target]: true });
  };



  useEffect(() => {
     async function fetchSportImages() {
       try {
         const { data, error } = await supabase.storage
           .from("sport_images")
           .list();

         if (error) {
           console.error(error.message);
           return;
         }

         if (data) {
           data.forEach((image) => {
             console.log(image.name); // Hier kannst du die Namen der Bilder ausgeben oder weitere Aktionen durchführen
           });
         }
       } catch (error) {
         console.error(error.message);
       }
     }
     fetchSportImages();
   }, []);




 useEffect(() => {
   if (
     Array.isArray(currentSport) &&
     currentSport.length > 0 &&
     selectedSport
   ) {
     // Zugriff auf das erste Element des äußeren Arrays
     const innerArray = currentSport[0]; // Hier wird angenommen, dass es nur ein inneres Array gibt
     const foundSport = innerArray.find((obj) => obj.name === selectedSport);

     if (foundSport) {
       setInputs((prevInputs) => ({
         ...prevInputs,
         label: foundSport.color,
         // Hier kannst du weitere Werte von foundSport setzen
       }));
     }
   } else {
     console.warn("currentSport is not an array or is empty");
   }
 }, [currentSport, selectedSport]);




  return (
    <div className="my-2 p-2 flex flex-col w-full overflow-scroll flex items-center justify-center">
      {submitting && <Spinner />}
      {!submitting && formIsOpen && (
        <form
          className="my-2  p-2 flex flex-col w-full"
          onSubmit={submitHandler}
        >
          <label className={styles.labels}> Title </label>
          <input
            type="text"
            name="title"
            placeholder="title"
            className={`${styles.inputs} ${
              isTouched.title && !validateTitle(inputs.title)
                ? styles.error
                : ""
            }`}
            onBlur={() => blurHandler("title")}
            onChange={changeHandler}
          ></input>

          <div className="h-8 h-20 md:h-12">
            {isTouched.title && !validateTitle(inputs.title) && (
              <p className={styles.errorText}>
                The title must be between 3 and 50 characters long
              </p>
            )}
          </div>

          <label className={styles.labels}> Text </label>
          <textarea
            name="text"
            placeholder="text"
            className={`${styles.inputs_textarea} ${
              isTouched.text && !validateText(inputs.text) ? styles.error : ""
            }`}
            onBlur={() => blurHandler("text")}
            onChange={changeHandler}
          ></textarea>

          <div className="h-8 h-20 md:h-12 ">
            {isTouched.text && !validateText(inputs.text) && (
              <p className={styles.errorText}>
                The text must be between 5 and 1000 characters long.
              </p>
            )}
          </div>

          <h2 className=" mb-4 text-center">
            enter the date and duration of your sports sessions
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-evenly items-center ">
            <div className={styles.date_div}>
              <input
                type="datetime-local"
                value={inputs.created_at}
                onChange={(e) =>
                  setInputs({ ...inputs, created_at: e.target.value })
                }
                className={styles.date_picker}
              />
            </div>

            <label className={styles.labels}> Duration </label>
            <input
              type="number"
              name="duration"
              placeholder="60 min"
              className={`${styles.inputs} ${
                isTouched.duration && !validateDuration(inputs.duration)
                  ? styles.error
                  : ""
              }`}
              onBlur={() => blurHandler("duration")}
              onChange={changeHandler}
            ></input>
          </div>

          <div className="h-14 h-20 md:h-12">
            {isTouched.duration && !validateDuration(inputs.duration) && (
              <p className={styles.errorText}>
                The duration must be a positive number.
              </p>
            )}

            {durationErrorMessage && (
              <p className={styles.errorText}> please set a date!</p>
            )}
          </div>

          <button type="submit" className={styles.submit_btn}>
            submit
          </button>

          {successMessage && (
            <p className={styles.successMessage_p}>
              entry successfully created
            </p>
          )}

          <p className={styles.errorText}>{errorMessage}</p>
        </form>
      )}
    </div>
  );
};

export default AddEntryForm;
