import Link from 'next/link';
import { useState } from 'react';
//STYLES 
import styles from './Plans.module.css'
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

//COMPONENTS
import AddEntryForm from '../Main/AddEntryForm';
import AddSportForm from '../Navigation/AddSportForm';
//REDUX 
import { useSelector, useDispatch } from 'react-redux';
//CUSTOM HOOKS
import { formatDate } from '@/custom-hooks/formatDate';
const Plans = () =>{

  const [isLoaded, setIsLoaded] = useState(false)
  const [entries, setEntries] = useState(false)
  const [addSport, setAddSport] = useState(false)
  const currentSports = useSelector((state) => state.sport.currentSport[0]);
  const [chosenSport, setChosenSport] = useState(null)
  const sportsArray = useSelector((state) => state.profile.sportsArray);


  const addSportHandler = () =>{
    setAddSport(!addSport)

  }

  let addSportBtnText = addSport ? 'close form' : 'add a sport'


  const chooseSportHandler = (e) =>{

    setChosenSport(e.currSport)

    console.log(e.currSport )


  }

  //console.log(sportsArray); entries!
  //console.log(currentSports); name and color
  //console.log(chosenSport) null ...

  // Sortiere das sportsArray nach created_at
  
  const sortedSportsArray = sportsArray?.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  console.log(sortedSportsArray);
  console.log(currentSports);

    return (
      <div className="flex-col justify-center items-center">
        <div className="flex justify-center h-16 items-center relative">
          <button className={styles.addSport_btn} onClick={addSportHandler}>
            {addSportBtnText}
          </button>
          <Link href="/" className={styles.home_link}>
            <FontAwesomeIcon icon={faHouse} />
          </Link>
        </div>

        <div className={styles.form_container}>
          {sportsArray === null && !addSport && <p>no entries were made yet</p>}
          {addSport && (
            <div className="w-6/12 flex-col">
              <h2 className="text-xl my-2 px-2"> choose your sport </h2>
              {currentSports &&
                currentSports.map((currSport) => (
                  <div
                    key={currSport.name}
                    className={styles.current_sport_div}
                  >
                    <button
                      onClick={() => chooseSportHandler({ currSport })}
                      className={`${styles.sport_buttons} ${
                        styles[currSport.color]
                      }`}
                    >
                      {currSport.name}
                    </button>
                  </div>
                ))}

              <h2 className="text-xl my-2 mt-8 px-2">
                tell us more about your goals :)
              </h2>
              <AddEntryForm chosenSport={chosenSport} />
            </div>
          )}

          {!addSport && sportsArray != null && (
            <div className={styles.container}>
              <p className="text-xl my-2"> your entries </p>
              {sortedSportsArray &&
                sortedSportsArray.map((sport) => (
                  <div key={sport.entryId} className={styles.sport_entry_div}>
                    <div>
                      <div className="relative flex">
                        <h3 className="text-xl relative">
                          <span
                            className={`${styles.sport_entry_name}  ${
                              styles[sport.label + "_title"]
                            }`}
                          >
                            {sport.name}
                          </span>
                        </h3>
                        <h3 className='text-l'> - {sport.title} -</h3>
                        <h3>   <span className={styles.sport_entry_date}>
                            {formatDate(sport.created_at)}
                          </span></h3>
                      </div>


                      <p className="m-2 border-l-4 p-2 min-h-24 border-rose-300">
                        {sport.entry}
                      </p>
                    </div>

                    <div className=" flex justify-center m-2 p-1">
                      <button className={styles.action_btns}>
                        {" "}
                        <FontAwesomeIcon
                          icon={faXmark}
                          className={styles.delete_icon}
                        />
                      </button>
                      <button className={styles.action_btns}>
                        {" "}
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={styles.check_icon}
                        />{" "}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
}

export default Plans