import { useEffect, useState } from "react";

//STYLES
import styles from "./AddEntryForm.module.css";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setAllSportsFromSupabase } from "@/store/sportReducer";


//SUPABASE
import { supabase } from "@/services/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { current } from "@reduxjs/toolkit";


const AddEntryForm = (props) => {
  const [successMessage, setSuccessMessage] = useState(false);
  const dispatch = useDispatch();

  const selectedSport = useSelector((state) => state.sport.selectedSport);
  const currentSport = useSelector((state) => state.sport.currentSport)


  const setFormIsOpen = props.setFormIsOpen;


  let label = "";

    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports
    );

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

 
  const [inputs, setInputs] = useState({
    //index: currentSport,
    name: selectedSport,
    title: "",
    text: "",
    created_at: "",
    duration: "",
    label: label,
    img: "",
  });



  const [isTouched, setIsTouched] = useState({ title: false, text: false });

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };




  useEffect(()=>{
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
    fetchSportImages()
  }, [])


   const [emotion, setEmotion] = useState("");

   const handleEmotionChange = (e) => {
     setEmotion(e.target.value);
   };



  const handleUpload = async () => {
    if (file) {
      const { data, error } = await supabase.storage
        .from("sport_images")
        .upload(`/`, file);
      if (error) {
        console.error("Error uploading image:", error.message);
      } else {
        console.log("Image uploaded successfully:", data.Key);
      }
    }
  };




  const submitHandler = async (e) => {
    e.preventDefault();

    if (validateTitle(inputs.title) && validateText(inputs.text)) {
      // Hier kannst du die Daten überprüfen und weiterverarbeiten
      // Zum Beispiel: Speichern der Daten in einer Datenbank oder einem anderen Speicherort

      const formattedTitle = formatText(inputs.title)
      const uniqueID = uuidv4();
      
      const data = {
        name: inputs.name,
        label: inputs.label,
        entryId: uniqueID,
        title: inputs.title,
        entry: inputs.text,
        entryPath: formattedTitle + "-" + uniqueID,
        duration: inputs.duration,
        created_at: inputs.created_at,
       
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
    return text.length >= 5 && text.length <= 1000;
  };

  const formatText = (text) => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  useEffect(() => {
    if (currentSport && selectedSport) {
      const foundSport = currentSport[0].find((obj) => obj.name === selectedSport);
      console.log(foundSport)
      if (foundSport) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          label: foundSport.color,
        }));
      }
    }
  }, [currentSport, selectedSport]);

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
      <div className={styles.date_div}>
        <input
          type="datetime-local"
          value={inputs.created_at}
          onChange={(e) => setInputs({ ...inputs, created_at: e.target.value })}
          className={styles.date_picker}
        />

        
      </div>

      <div className="h-8">
        {isTouched.text && !validateText(inputs.text) && (
          <p className={styles.errorText}>
            Text must be between 5 and 400 characters
          </p>
        )}
      </div>

      <div className={styles.duration_div}>
        <label className={styles.labels}> Duration </label>
        <input
          type="number"
          name="duration"
          placeholder="60 min"
          className={`${styles.inputs} ${
            isTouched.text && !validateText(inputs.text) ? styles.error : ""
          }`}
          onBlur={() => blurHandler("duration")}
          onChange={changeHandler}
        ></input>

        <label className={styles.labels}>Emotion</label>
        <div>
          <label>
            <input
              type="radio"
              name="emotion"
              value="sad"
              checked={emotion === "sad"}
              onChange={handleEmotionChange}
            />
            😢 Traurig
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="emotion"
              value="neutral"
              checked={emotion === "neutral"}
              onChange={handleEmotionChange}
            />
            😐 Neutral
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              name="emotion"
              value="happy"
              checked={emotion === "happy"}
              onChange={handleEmotionChange}
            />
            😄 Lachend
          </label>
        </div>
      </div>

      <label className={styles.labels}> Image </label>
      <input
        type="file"
        name="img"
        onChange={handleFileChange}
        className={styles.inputs}
      ></input>
      <button onClick={handleUpload}> go </button>

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
