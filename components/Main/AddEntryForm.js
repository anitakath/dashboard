import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//STYLES
import styles from "./AddEntryForm.module.css";
//REDUX
import { useSelector, useDispatch} from "react-redux";
//CUSTOM HOOKS
import { useSubmitHandler } from "@/custom-hooks/useSportEntries";
import useFetchEntries from "@/custom-hooks/entries/useFetchEntries";
//COMPONENTS
import Spinner from "../UI/Spinner";

const AddEntryForm = ({chosenSport}) => {
  const userId = useSelector((state) => state.auth.userId)
  const router = useRouter();
  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const currentSport = useSelector((state) => state.sport.currentSport);
  const currentYear = useSelector((state) => state.calendar.year)
  const currentPath = router.pathname;
  const dispatch = useDispatch();
  const {fetchPlannedSports} = useFetchEntries()
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
    provider: "",
  });


  const isValidTitle = (title) => title.length >= 3 && title.length <= 50;
  const isValidText = (text) => text.length >= 5 && text.length <= 1000;
  const isValidDuration = (duration) => {
    const num = parseFloat(duration);
    return !isNaN(num) && num > 0;
  };



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


 const sportProviders = [
  "Urban Sports Club",
  "Wellpass",
  "eGym",
  "Self Paid",
  "At Home", 
  "Club",
  "Other"
];

const onSubmit = async (e) => {
  try {
    await submitHandler(e); 
    await fetchPlannedSports(userId, currentYear, dispatch);
  } catch (error) {
    console.error("error while submitting", error);
  }
};




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
          onSubmit={onSubmit}
        >
          <label className={styles.labels}> Title </label>
          <input
            type="text"
            name="title"
            placeholder="title"
            className={`${styles.inputs} ${
              isTouched.title && !isValidTitle(inputs.title)
                ? styles.error
                : ""
            }`}
            onBlur={() => blurHandler("title")}
            onChange={changeHandler}
          ></input>

          <div className="md:h-12">
            {isTouched.title && !isValidTitle(inputs.title) && (
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
              isTouched.text && !isValidText(inputs.text) ? styles.error : ""
            }`}
            onBlur={() => blurHandler("text")}
            onChange={changeHandler}
          ></textarea>

          <div className="  md:h-12 ">
            {isTouched.text && !isValidText(inputs.text) && (
              <p className={styles.errorText}>
                The text must be between 5 and 1000 characters long.
              </p>
            )}
          </div>

          <div className={styles.providerContainer}>
          {currentPath === "/profile" && <p className="absolute text-xs top-1 left-0 text-zinc-300"> SCROLL TO THE RIGHT  </p>}
            {sportProviders.map((provider) => (
              <div key={provider} className={styles.providerDiv}>
              
                <input 
                  type="radio" 
                  id={provider} 
                  name="provider" 
                  value={provider} 
                  onChange={changeHandler} 
                 
                />
                <label htmlFor={provider}>{provider}</label>
              </div>
            ))}
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
                isTouched.duration && !isValidDuration(inputs.duration)
                  ? styles.error
                  : ""
              }`}
              onBlur={() => blurHandler("duration")}
              onChange={changeHandler}
            ></input>
          </div>

          <div className="h-14 h-18 lg:h-20 md:h-12">
            {isTouched.duration && !isValidDuration(inputs.duration) && (
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
