
import React, { useState } from "react";
import Link from "next/link";

//REDUX

import { setNavigation, setSelectedSport } from "@/store/sportReducer";
import { useSelector, useDispatch } from "react-redux";


//SUPABASE
import { supabase } from "@/services/supabaseClient";





//STYLES
import styles from './AddSportForm.module.css'

const AddSportForm = (props) =>{

    const [title, setTitle] = useState("");
    const [entry, setEntry] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(false)

    const dispatch = useDispatch()
    const navigation = useSelector((state) => state.sport.navigation)

    console.log(navigation)

    console.log(name)


   


    const handleSubmit = async (e) =>{
      e.preventDefault();

      const data = {name}

      if (navigation.includes(name)) {

        setError(true)
        return;
      } else{


        console.log('updating navigation')
        setError(false)
        const updated = [...navigation, name];
        dispatch(setNavigation(updated));
        dispatch(setSelectedSport(name));
        props.addSportClickHandler();
        

        /*
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
              console.log(
                "Sport successfully inserted into Supabase table:",
                newSport
              );

              props.addSportClickHandler();
            }
          } catch (error) {
            console.error("Error inserting data into Supabase table:", error);
          }

          */


        }

   
      
        
    }


    return (
      <form className=" my-2 py-2" onSubmit={handleSubmit}>
        <label className=" text-xl"> Type </label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        ></input>

      

        {error && (
          <p className="text-xs text-red-600s">
          
            you have already added this sport to your diary. navigate to your
            profile <Link href="/profile" className={styles.link}> here </Link> to get an overview of sour sports
          </p>
        )}

        {!error && (
          <button type="submit" className={styles.add_btn}>
            add sport
          </button>
        )}
      </form>
    );
}

export default AddSportForm