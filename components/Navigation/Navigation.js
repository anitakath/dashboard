import {useEffect, useState} from 'react'

//STYLES
import styles from './Navigation.module.css'


//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport, setAllSports } from "@/store/sportReducer";


const Navigation = ()=> {

   
    const [active, setActive] = useState(null)
    
    const allSports = useSelector((state) => state.sport.allSports);
    const currentSport = useSelector((state) => state.sport.selectedSport);
    
    const dispatch = useDispatch();


    useEffect(() => {
    fetch("/api/get-sports")
      .then((response) => response.json())
      .then((data) => dispatch(setAllSports(data.sports)));
    }, []);


     const handleSportClick = (index) => {
       setActive(index);
       dispatch(setSelectedSport(index));
     };

     useEffect(()=>{
       setActive(currentSport)
     }, [currentSport])


     console.log(allSports)

    return (
      <div className="border-r w-1/5 p-8 flex flex-col items-center shadow-section">
        
        <h1 className={styles.title}> DASHBOARD </h1>
        <h2 className={styles.subtitle}> your sports </h2>


        <ul className='w-full'>
          {allSports && 
            allSports.map((sport, index) => (
            <li key={index}>
              <button 
                className={`${styles.sport_btn} ${active === index ? styles.active : ''}`}
                onClick={() => handleSportClick(index)}
                  >{sport.name}</button>
            </li>
          ))}
        </ul>

        <button className={styles.addSport_btn}> + </button>

      </div>
    );
}

export default Navigation