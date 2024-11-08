import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//STYLES
import styles from "./AddEntryForm.module.css";
//REDUX
import { useSelector } from "react-redux";

//CUSTOM HOOKS
import { useSubmitHandler } from "@/custom-hooks/useSportEntries";

import {
  validateTitle,
  validateText,
  validateDuration,
} from "@/custom-hooks/validation/validation";
//COMPONENTS
import Spinner from "../UI/Spinner";


const AddEntryForm = ({setFormIsOpen, chosenSport}) => {
  const userId = useSelector((state) => state.auth.userId)
  const router = useRouter();
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const currentSport = useSelector((state) => state.sport.currentSport);
  const currentPath = router.pathname;
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  let label = "";
  let icon ="";
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
    icon: icon,
  });


  /* ------------ ADD A SPORT HANDLER --------------- */
  const {
    submitHandler,
    successMessage,
    durationErrorMessage,
    errorMessage,
    submitting,
    formIsOpen,
  } = useSubmitHandler(currentPath, chosenSport, inputs, userId, currentSport);


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
      icon = foundSport.icon;
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
        //console.log("Titel ist ungültig");
      }
    }
    if (name === "text") {
      if (!validateText(value)) {
        //console.log("Text ist ungültig");
      }
    }
    if (name === "duration") {
      if (!validateDuration(value)) {
        //console.log("Dauer ist ungültig");
      }
    }
  };

  



  const blurHandler = (target) => {
    setIsTouched(true);
    setIsTouched({ ...isTouched, [target]: true });
  };




 useEffect(() => {


   if (
     Array.isArray(currentSport) &&
     currentSport.length > 0 &&
     selectedSport
   ) {
     // Zugriff auf das erste Element des äußeren Arrays

     const foundSport = currentSport.find((obj) => obj.name === selectedSport);

     if (foundSport) {
       setInputs((prevInputs) => ({
         ...prevInputs,
         label: foundSport.color,
         icon: foundSport.icon,

       }));
     }
   } else {
     console.warn("currentSport is not an array or is empty");
   }
 }, [currentSport, selectedSport]);


 console.log(inputs)
 console.log(selectedSport)


  return (
    <div className="my-2 p-2 flex flex-col justify-center w-full overflow-scroll flex items-center justify-center">
      {submitting && <Spinner />}
      {!submitting && formIsOpen && (
        <form
          className="my-2  p-2 flex flex-col flex flex-col items-center w-full"
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

          <div className=" h-20 md:h-12 ">
            {isTouched.text && !validateText(inputs.text) && (
              <p className={styles.errorText}>
                The text must be between 5 and 1000 characters long.
              </p>
            )}
          </div>

          <h2 className=" mb-4 text-center">
            enter the date and duration of your sports sessions
          </h2>
          <div className="flex pb-2 lg:p-0 w-full lg:w-6/12 border-b-2 border-red-700 w-6/12 flex-col md:flex-row items-center justify-evenly items-center ">
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
              className={`${styles.duration} ${
                isTouched.duration && !validateDuration(inputs.duration)
                  ? styles.error
                  : ""
              }`}
              onBlur={() => blurHandler("duration")}
              onChange={changeHandler}
            ></input>
          </div>

          <div className="h-14 h-18 lg:h-20 md:h-12">
            {isTouched.duration && !validateDuration(inputs.duration) && (
              <p className={styles.errorText}>
                The duration must be a positive number.
              </p>
            )}

            {durationErrorMessage && (
              <p className={styles.errorText}> please set a date!</p>
            )}
          </div>
          <div className=" w-full  flex  justify-center">
            <button type="submit" className={styles.submit_btn}>
              submit
            </button>

            {successMessage && <button  className={styles.submit_btn} onClick={ () => setFormIsOpen(false)}> close form </button>}
          </div>

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
