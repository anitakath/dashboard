import {useEffect, useState} from 'react'

//STYLES
import styles from './Navigation.module.css'

const Navigation = ()=> {

    const [sports, setSports] = useState([]);
    const [active, setActive] = useState(null)

    useEffect(() => {
    fetch("/api/get-sports")
        .then((response) => response.json())
        .then((data) => setSports(data.sports));
    }, []);



    return (
      <div className="border-r w-1/5 p-8 flex flex-col items-center shadow-section">
        
        <h1 className={styles.title}> DASHBOARD </h1>
        <h2 className={styles.subtitle}> Deine Sportarten </h2>


        <ul className='w-full'>
          {sports.map((sport, index) => (
            <li key={index}>
              <button className={styles.sport_btn}>{sport}</button>
            </li>
          ))}
        </ul>

        <button className={styles.addSport_btn}> + </button>

      </div>
    );
}

export default Navigation