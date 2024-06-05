
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

  const [name, setName] = useState("");
  const [error, setError] = useState(false)

  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.sport.navigation) 


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
    } 
  }


    return (
      <form className="w-full my-2 p-2" onSubmit={handleSubmit}>
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