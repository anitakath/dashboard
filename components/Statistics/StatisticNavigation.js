import styles from "../../pages/statistics/Statistics.module.css";

const StatisticNavigation = ({ currentSport, setSport, sport }) => {
    console.log(sport);

    return (
        <div className={styles.container_div}>
            {currentSport && currentSport.map((sportItem, index) => (
                <div
                    key={sportItem.id || index}
                    className={`${styles.sport_div} ${sportItem.name === sport ? styles.activeNavigationButton : ''} ${styles[sportItem.color]}`}
                >
                    <button
                        className="text-m md:text-xl text-center"
                        onClick={() => setSport(sportItem.name)} 
                    >
                        {sportItem.name}
                    </button>
                </div>
            ))}
            <p> choose</p>
        </div>
    );
};

export default StatisticNavigation;