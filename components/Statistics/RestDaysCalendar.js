
import styles from "./RestDaysCalendar.module.css";
import useCalendar from "@/custom-hooks/useCalendar";
import useStatistics from "@/custom-hooks/Statistics/useStatistics";

const RestDaysCalendar = ({ allSupabaseSports, date }) => {
  const { restDaysPerMonth } = useStatistics(allSupabaseSports, date);
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const { completeMonths } = useCalendar();
  const currentMonth = completeMonths[currentMonthIndex];

  let adjustedRestDays = {};
  completeMonths.forEach((month, index) => {
    if (index < currentMonthIndex) {
      adjustedRestDays[month] = restDaysPerMonth[month];
    } else if (index === currentMonthIndex) {
      adjustedRestDays[month] = "🐣";
    } else {
      adjustedRestDays[month] = "-"; // Für zukünftige Monate "-"
    }
  });

  return (
    <div className={styles.container}>
      <ul className={styles.table}>
        {completeMonths &&
          completeMonths.map((month, index) => (
            <li
              key={month} // Hier wird der key prop hinzugefügt
              className={`${styles.listItem} ${
                month === currentMonth ? styles.active : ""
              }`}
            >
              <p className="mt-2">{month}</p>
              <span className="mb-7 text-xl">{adjustedRestDays[month]}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RestDaysCalendar;
