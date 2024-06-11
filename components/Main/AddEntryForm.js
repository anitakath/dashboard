import { useState } from "react";

//STYLES
import styles from "./AddEntryForm.module.css";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setAllSportsFromSupabase } from "@/store/sportReducer";


//SUPABASE
import { supabase } from "@/services/supabaseClient";


const AddEntryForm = (props) => {
  const [successMessage, setSuccessMessage] = useState(false);
  const dispatch = useDispatch();


  const setFormIsOpen = props.setFormIsOpen;



  const currentSport = useSelector((state) => state.sport.selectedSport);

  const [inputs, setInputs] = useState({
    //index: currentSport,
    name: currentSport,
    title: "",
    text: "",
    img: "",
  });

  const [isTouched, setIsTouched] = useState({ title: false, text: false });



  console.log(inputs.title)

  const submitHandler = async (e) => {
    e.preventDefault();

    if (validateTitle(inputs.title) && validateText(inputs.text)) {
      // Hier kannst du die Daten überprüfen und weiterverarbeiten
      // Zum Beispiel: Speichern der Daten in einer Datenbank oder einem anderen Speicherort

      const formattedTitle = formatText(inputs.title)
      
      const data = {
        name: inputs.name,
        entryId: formattedTitle,
        title: inputs.title,
        entry: inputs.text,
        //img: inputs.img,
      };

      try {
        const { data: newSport, error } = await supabase
          .from("sports")
          .insert([data]);

        if (error) {
          console.error("Failed to insert data into Supabase table:", error);
        } else {
          console.log(
            "Data successfully inserted into Supabase table:",
            newSport
          );
          fetchSportsData()
        }
      } catch (error) {
        console.error("Error inserting data into Supabase table:", error);
      }

      setSuccessMessage(true);
   

      setTimeout(() => {
        setSuccessMessage(false);
      }, 5000);


      console.log("input values:", inputs);
      setFormIsOpen(false)


    } else {
      setSuccessMessage(false);
      console.log("Validation failed. Please check your input.");
    }
  };


     
  const fetchSportsData = async () => {
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) {
        throw new Error("Failed to fetch sports data");
      }
      const data = await response.json();

      dispatch(setAllSportsFromSupabase(data.data));
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
  };


  const blurHandler = (target) => {
    setIsTouched(true);
    setIsTouched({ ...isTouched, [target]: true });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const validateTitle = (title) => {
    return title.length >= 3 && title.length <= 50;
  };

  const validateText = (text) => {
    return text.length >= 5 && text.length <= 400;
  };

  const formatText = (text) => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  

  return (
    <form className=" my-2 p-2 flex flex-col" onSubmit={submitHandler}>
      <label className={styles.labels}> Title </label>

      <input
        type="text"
        name="title"
        placeholder="title"
        className={`${styles.inputs} ${
          isTouched.title && !validateTitle(inputs.title) ? styles.error : ""
        }`}
        onBlur={() => blurHandler("title")}
        onChange={changeHandler}
      ></input>

      <div className="h-8">
        {isTouched.title && !validateTitle(inputs.title) && (
          <p className={styles.errorText}>
            Title must be between 3 and 50 characters
          </p>
        )}
      </div>

      <label className={styles.labels}> Text </label>
      <input
        type="text"
        name="text"
        placeholder="text"
        className={`${styles.inputs} ${
          isTouched.text && !validateText(inputs.text) ? styles.error : ""
        }`}
        onBlur={() => blurHandler("text")}
        onChange={changeHandler}
      ></input>

      <div className="h-8">
        {isTouched.text && !validateText(inputs.text) && (
          <p className={styles.errorText}>
            Text must be between 5 and 400 characters
          </p>
        )}
      </div>

      <label className={styles.labels}> Image </label>
      <input
        type="text"
        name="img"
        placeholder="upload image..."
        className={styles.inputs}
        onChange={changeHandler}
      ></input>

      <button type="submit" className={styles.submit_btn}>
        submit
      </button>
      {successMessage && (
        <p className={styles.successMessage_p}> entry successfully created </p>
      )}
    </form>
  );
};

export default AddEntryForm;
