

//COMPONENTS
import AddSportForm from "@/components/Navigation/AddSportForm";
import AddEntryForm from "@/components/Main/AddEntryForm";
//STYLES
import styles from './Plans.module.css'
import colors from '../../../styles/Colors.module.css'

const AddSportField = (props) =>{

    const addSport = props.addSport
    const currentSports = props.currentSports
    const activeSport = props.activeSport
    const addSportClickHandler = props.addSportClickHandler;
    const formIsOpen = props.formIsOpen;
    const chosenSport = props.chosenSport;
    const chooseSportHandler = props.chooseSportHandler;


    return (
      <div>
        {addSport && (
          <div className="w-full flex flex-col md:flex-row p-2 shadow-md shadow-gray-200">
            <div className=" border-b-4 pb-8 mb-6 w-full md:w-6/12 flex items-center h-full flex-col">
              <div className=" border-b-4 pb-8 flex-col w-full">
                <h2 className="text-2xl my-2 px-2"> choose your sport </h2>
                {currentSports &&
                  currentSports.map((currSport) => (
                    <div
                      key={currSport.name}
                      className={styles.current_sport_div}
                    >
                      <button
                        onClick={() => chooseSportHandler({ currSport })}
                        className={`${styles.sport_buttons} ${
                          colors[currSport.color]
                        } ${
                          activeSport === currSport.name ? styles.active : ""
                        }`}
                      >
                        {currSport.name}
                      </button>
                    </div>
                  ))}
              </div>

              <h2 className="text-2xl  my-4 px-2">Your sport is not listed?</h2>
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

            <div className=" flex-col md:mx-2 w-full md:w-6/12 justify-start  mt-2">
              <h2 className=" mb-4 text-center text-2xl px-2">
                tell us more about your goals :)
              </h2>

              <AddEntryForm chosenSport={chosenSport} />
            </div>
          </div>
        )}
      </div>
    );
}

export default AddSportField