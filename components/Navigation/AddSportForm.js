
import React, { useState } from "react";


//REDUX
import { useDispatch } from "react-redux";

//SUPABASE
import { supabase } from "@/services/supabaseClient";



//STYLES
import styles from './AddSportForm.module.css'

const AddSportForm = (props) =>{

    const [title, setTitle] = useState("");
    const [entry, setEntry] = useState("");
    const [name, setName] = useState("");

    console.log(props)

   


    const handleSubmit = async (e) =>{
        e.preventDefault();

        const data = {name, title, entry}

        console.log(data)
        try {
          const { data: newSport, error } = await supabase
            .from("sports")
            .insert([data]);

          if (error) {
            console.error("Failed to insert data into Supabase table:", error);
          } else {
            console.log(
              "Sport successfully inserted into Supabase table:",
              newSport

            );

            props.addSportClickHandler()


          }
        } catch (error) {
          console.error("Error inserting data into Supabase table:", error);
        }
        
    }


    return (
      <form className=" my-2 py-2" onSubmit={handleSubmit} >
        <label className=" text-xl"> Type </label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        ></input>

        <label className=" text-xl"> Title </label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        ></input>

        <label className=" text-xl"> Text </label>
        <input
          type="text"
          onChange={(e) => setEntry(e.target.value)}
          className={styles.input}
        ></input>

        <button type="submit" className={styles.add_btn}>
          add sport
        </button>
      </form>
    );
}

export default AddSportForm