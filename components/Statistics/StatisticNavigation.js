import styles from "../../pages/statistics/Statistics.module.css";
import { useState, useEffect } from "react";

const StatisticNavigation = ({ currentSport, setSport, sport }) => {

    const [fixedNavigation, setFixedNavigation] = useState(false)

    const navigateToChosenSportHandler = (sport) =>{
        const element = document.getElementById('sportsOverview');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
        }
        setFixedNavigation(true)
        setSport(sport)
    }

    // Effect to handle scroll events
    /*
    useEffect(() => {
        console.log("useEffect ausgeführt"); // Überprüfen, ob useEffect aufgerufen wird
        const handleScroll = () => {
            const sportsOverviewElement = document.getElementById('sportsOverview');
            if (sportsOverviewElement) {
                const rect = sportsOverviewElement.getBoundingClientRect();
                console.log(rect); // Überprüfen, ob rect korrekt erfasst wird
                if (rect.top > window.innerHeight || rect.bottom < 0) {
                    setFixedNavigation(false);
                } else {
                    setFixedNavigation(true);
                }
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);*/

    /*${fixedNavigation ? styles.fixedNavigation : ''} */

    return (
        <div className={` ${styles.container_div} `} id="statisticNavigation">
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