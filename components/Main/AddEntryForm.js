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
  
  const [isTouched, setIsTouched] = useState({ title: false, text: false });
  const [inputs, setInputs] = useState({
    name: selectedSport,
    title: "",
    text: "",
    created_at: "",
    duration: "",
    label: "",
    userId,
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
  } = useSubmitHandler(currentPath, chosenSport, inputs, userId, currentSport);



  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };


   const blurHandler = (target) => {
     setIsTouched((prev) => ({ ...prev, [target]: true }));
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



  return (
    <div className="lg:my-2 lg:p-2  flex-col justify-center w-full overflow-scroll flex items-center ">
      {submitting && (
        <div className="relative w-full h-96 flex justify-center items-center">
            <Spinner text="submitting"/> 
        </div>
       )}
      {!submitting && formIsOpen && (
        <form
          className="my-2  p-2   flex flex-col items-center w-full"
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

          <div className=" md:h-12">
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
          <div className="flex pb-2 lg:p-0  border-b-2 w-full flex-col md:flex-row justify-evenly items-center ">
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
          <div className=" w-full flex  justify-center">
            <button className={styles.submit_btn}>
              submit
            </button>

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
