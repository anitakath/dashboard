
import styles from "../../pages/statistics/Statistics.module.css"
const StatisticNavigation = ({currentSport}) =>{


  return(
    <div className={styles.container_div}>


      {currentSport && currentSport.map((sport, index) => (
       <div key={sport.id || index} className={`${styles.sport_div} ${styles[sport.color]}`}>
           <button className="text-m md:text-xl text-center">
               {sport.name}
           </button>
       </div>
      ))}
      
    </div>

  )


}

export default StatisticNavigation