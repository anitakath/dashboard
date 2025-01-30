import styles from "../../pages/statistics/Statistics.module.css";

const StatisticNavigation = ({ currentSport, setSport, sport }) => {


    const navigateToChosenSportHandler = (sport) =>{
        const element = document.getElementById('sportsOverview');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    return (
        <div className={styles.container_div} id="statisticNavigation">
            {currentSport && currentSport.map((sportItem, index) => (
                <div
                    key={sportItem.id || index}
                    className={`${styles.sport_div} ${sportItem.name === sport ? styles.activeNavigationButton : ''} ${styles[sportItem.color]}`}
                >
                    <button
                        className={styles.sportNavigationButton}
                        onClick={() => navigateToChosenSportHandler(sportItem.name)} 
                    >
                        {sportItem.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default StatisticNavigation;