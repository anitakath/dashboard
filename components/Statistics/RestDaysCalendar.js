
import styles from './RestDaysCalendar.module.css'
//CUSTOM HOOKS
import { completeMonths } from '@/custom-hooks/useCalendar';
import useStatistics from '@/custom-hooks/Statistics/useStatistics';

const RestDaysCalendar = ({ allSupabaseSports, date }) => {
  const { restDaysPerMonth } = useStatistics(allSupabaseSports, date);
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonth = completeMonths[currentMonthIndex]; 
  let adjustedRestDays = {};

  completeMonths.forEach((month, index) => {
    if (index < currentMonthIndex) {
      adjustedRestDays[month] = restDaysPerMonth[month];
    } else if(index === currentMonthIndex){
        adjustedRestDays[month] = "🐣";
    } else{
      adjustedRestDays[month] = "-"; // Für zukünftige Monate "-"
    }
  });

  return (
    <div className={styles.container}>
      {completeMonths &&
        completeMonths.map((month) => (
          <ul className={styles.table}>
            <li
              className={`${styles.listItem} ${
                month === currentMonth ? styles.active : ""
              }`}
            >
              <p className="mt-2">{month}</p>
              <span className="mb-7 text-xl">{adjustedRestDays[month]}</span>
            </li>
          </ul>
        ))}
    </div>
  );
};

export default RestDaysCalendar