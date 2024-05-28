import {useEffect, useState} from 'react'

//STYLES
import styles from './Navigation.module.css'

import { supabase } from '@/services/supabaseClient';


//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport, setAllSports, setAllSportsFromSupabase } from "@/store/sportReducer";


//COMPONENTS
import AddSportForm from './AddSportForm';

const Navigation = ()=> {
  
  const [formIsOpen, setFormIsOpen] = useState(false)
  const [active, setActive] = useState(null)
  const currentSport = useSelector((state) => state.sport.selectedSport);

  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)

    
  const dispatch = useDispatch();

  const uniqueSports = Array.from(
    new Set(allSupabaseSports.map((sport) => sport.name))
  );

  
    
    
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

    useEffect(() => {
      fetchSportsData();
    }, []);



     const handleSportClick = (sport) => {
       setActive(sport);
       dispatch(setSelectedSport(sport));
     };


     useEffect(()=>{
       setActive(currentSport)
     }, [currentSport])


  
     const addSportClickHandler = () =>{
       setFormIsOpen((prevState) => !prevState)
     }


     let addBtn_text = formIsOpen ? '-' : '+'

    return (
      <div className="border-r w-1/5 p-8 flex flex-col items-center shadow-section">
        <h1 className={styles.title}> DASHBOARD </h1>
        <h2 className={styles.subtitle}> your sports </h2>

        {!formIsOpen && (
          <ul className="w-full">
            {uniqueSports &&
              uniqueSports.map((sport, index) => (
                <li key={index}>
                  <button
                    className={`${styles.sport_btn} ${
                      active === sport ? styles.active : ""
                    }`}
                    onClick={() => handleSportClick(sport)}
                  >
                    {sport}
                  </button>
                </li>
              ))}
          </ul>
        )}

        {formIsOpen && (
          <AddSportForm addSportClickHandler={addSportClickHandler} />
        )}

        <button className={styles.addSport_btn} onClick={addSportClickHandler}>
          {addBtn_text}
        </button>
      </div>
    );
}

export default Navigation