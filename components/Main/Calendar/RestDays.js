//STYLES
import styles from "../Calendar.module.css";
import { useSelector } from "react-redux";
const RestDays = (props) => {
  const restDays = useSelector((state) => state.calendar.restDaysPerMonth);

  const renderRestDays = () => {
    return Object.keys(restDays).map((month) => (
      <div key={month}>
        <ul>
          <li className={styles.restDays_li}>
            <span className={styles.restDays_li_span}>{month}: </span>{" "}
            {restDays[month]}
          </li>
        </ul>
      </div>
    ));
  };

  return <div>{renderRestDays()}</div>;
};

export default RestDays;
