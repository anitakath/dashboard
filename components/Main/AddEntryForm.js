import { useState } from "react";

//STYLES
import styles from "./AddEntryForm.module.css";

//REDUX
import { useSelector } from "react-redux";
import { current } from "@reduxjs/toolkit";

//SUPABASE
import { supabase } from "@/services/supabaseClient";

const AddEntryForm = () => {


  
const currentSport = useSelector((state) => state.sport.selectedSport);

  const [inputs, setInputs] = useState({
    //index: currentSport,
    name: currentSport,
    title: "",
    text: "",
    img: "",
  });

  console.log(inputs);

  const [isTouched, setIsTouched] = useState({ title: false, text: false });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (validateTitle(inputs.title) && validateText(inputs.text)) {
      // Hier kannst du die Daten überprüfen und weiterverarbeiten
      // Zum Beispiel: Speichern der Daten in einer Datenbank oder einem anderen Speicherort

      const data = {
        name: inputs.name,
        title: inputs.title,
        entry: inputs.text,
        //img: inputs.img,
      };

      console.log(data)

      
      try {
        const { data: newSport, error } = await supabase
          .from("sports")
          .insert([data]);

        if (error) {
          console.error(
            "Failed to insert data into Supabase table:",
            error
          );
        } else {
          console.log("Data successfully inserted into Supabase table:",newSport);
        }
      } catch (error) {
        console.error("Error inserting data into Supabase table:", error);
      }
      

      console.log("Input values:", inputs);

      
    } else {
      console.log("Validation failed. Please check your input.");
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
    </form>
  );
};

export default AddEntryForm;
