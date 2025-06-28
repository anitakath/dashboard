//COMPONENTS
import AddSportForm from "@/components/Navigation/AddSportForm";
import AddEntryForm from "@/components/Main/AddEntryForm";
//STYLES
import styles from './Plans.module.css'
import colors from '../../../styles/Colors.module.css'
import { useSelector } from "react-redux";

const AddSportField = ({addSport, addSportHandler, addSportBtnText, currentSports, activeSport, addSportClickHandler, formIsOpen, setFormIsOpen, chosenSport, chooseSportHandler}) =>{


  const allPlannedSports = useSelector((state) => state.sport.allPlannedSports)

  const updateCurrentSports = (currentSports, allPlannedSports) => {
    const existingSportNames = new Set(currentSports.map(sport => sport.name.trim().toLowerCase()));
  
    allPlannedSports.forEach(plannedSport => {
      const sportName = plannedSport.name?.trim(); // <- statt title
      if (sportName && !existingSportNames.has(sportName.toLowerCase())) {
        currentSports.push({
          name: sportName,
          color: plannedSport.label || 'defaultColor', // <- label statt color
          icon: plannedSport.icon || null
        });
      }
    });
  
    return currentSports;
  };
  
  // Jetzt ist die Funktion definiert und kann verwendet werden
  const updatedCurrentSports = updateCurrentSports([...currentSports], allPlannedSports);
  




   

  return (
    <div>
      {addSport && (
        <div className="w-full flex flex-col md:flex-row p-4">
          <div className=" pb-8 mb-6 w-full md:w-6/12 flex items-center h-full flex-col">
            <div className=" mb-2 flex-col w-full">
              <h2 className="my-2 px-2"> choose your sport </h2>
              <div  className={styles.current_sport_grid}>
                
                {currentSports &&
                  currentSports.map((currSport) => (
                    <div key={currSport.name}>
                      <button
                        onClick={() => chooseSportHandler({ currSport })}
                        className={`${styles.sport_buttons} ${
                          colors[currSport.color]
                        } ${activeSport === currSport.name ? styles.active : ""}`}
                      >
                        {currSport.name}
                      </button>
                    </div>
                  ))}
                
              </div>
            </div>

            <h2 className="mb-2 px-2">Your sport is not listed?</h2>
            <button
              onClick={addSportClickHandler}
              className={styles.addNewSport_btn}
            >
              Add a new sport!
            </button>
            
            {formIsOpen && (
              <AddSportForm addSportClickHandler={addSportClickHandler} />
            )}
          </div>

          <div className="flex-col md:mx-2 w-full md:w-6/12 justify-start  mt-2">
            <h2 className=" mb-4 text-center px-2">
              tell us more about your goals :)
            </h2>

            <AddEntryForm chosenSport={chosenSport} setFormIsOpen={setFormIsOpen} />
          </div>
        </div>
      )}
      <div className="w-full py-6 flex justify-center">
        <button className={styles.addSport_btn} onClick={addSportHandler}>
          {addSportBtnText}
        </button>
      </div>
    </div>
  );
}

export default AddSportField