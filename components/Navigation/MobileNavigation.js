import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import styles from './MobileNavigation.module.css'
import SortSports from './SortSports'
//CUSTOM HOOKS
import { useFontAwesomeIcons } from '@/custom-hooks/FontAwesome/useFontAwesomeIcons'

const MobileNavigation = ({
  deleteSportHandler,
  sortedNavigationArr,
  setSortedNavigationArr,
  active,
  handleSportClick,
  selectedSport,
  mobileSportsNavIsOpen,
  setMobileSportsNavIsOpen,
  allSupabaseSports, 
  formIsOpen,
  addSportClickHandler
}) => {

  let btn_text = mobileSportsNavIsOpen ? "close" : "open";
  const fontAwesomeIcons = useFontAwesomeIcons();

  return (
    <div className="w-full p-2 flex-col lg:hidden overflow-scroll">
      <button
        onClick={() => setMobileSportsNavIsOpen(!mobileSportsNavIsOpen)}
        className="primary_button"
      >
        {btn_text} sports
      </button>
      {mobileSportsNavIsOpen && (
        <SortSports
          setSortedNavigationArr={setSortedNavigationArr}
          sortedNavigationArr={sortedNavigationArr}
          allSupabaseSports={allSupabaseSports}
        />
      )}
      {mobileSportsNavIsOpen && (
        <ul className={styles.ul}>
          {sortedNavigationArr.map((sportsObj, index) => (
            <div className="relative flex-col" key={index}>
              <li className="flex">
                <button
                  className={`${styles.sport_btn} ${
                    active === sportsObj.name && selectedSport !== "all"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleSportClick(sportsObj.name)}
                >
                  <button
                    className={styles.delete_btn}
                    onClick={() => deleteSportHandler(sportsObj.name)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className={styles.trash_icon}
                    />
                  </button>
                  <span className={styles.sportBtnText}>{sportsObj.name}</span>
                  <div className={styles.circle_div}>
                    <div
                      className={`${styles.circle_background} ${styles[sportsObj.color]}`}
                    ></div>
                    <div className={`${styles[sportsObj.color]} ${styles.circle}`}>
                      {sportsObj.icon &&
                        fontAwesomeIcons[sportsObj.icon] && (
                          <FontAwesomeIcon
                            icon={fontAwesomeIcons[sportsObj.icon]}
                          />
                        )}
                    </div>
                  </div>
                </button>
              </li>
            </div>
          ))}
          <li className="flex mx-0.5 relative items-center">
            <button
              className={styles.addSport_btn}
              onClick={addSportClickHandler}
            >
              {formIsOpen ? "-" : "+"}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MobileNavigation;