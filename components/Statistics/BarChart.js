
import { useEffect, useState } from 'react';
import styles from './BarChart.module.css'

//COMPONENTS
import SelectTimePeriod from './SelectTimePeriod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
const BarChart = ({
  allSupabaseSports,
  sortedSportsByCount,
  date,
  setDate,
  resultArray,
  showBarChart,
  //scrollHandler,
  isScrolled
}) => {

  const sportCounts = {};

  // Filtere die allSupabaseSports basierend auf dem date-Objekt
  const filteredSports = allSupabaseSports.filter((sport) => {
    const createdAtDate = new Date(sport.created_at);
    const year = createdAtDate.getFullYear();
    const month = createdAtDate.getMonth(); // 0 = Januar, 1 = Februar, ..., 11 = Dezember

    if (date.month === "All") {
      return year === date.year; // Nur das Jahr überprüfen
    } else {
      // Monat in Zahl umwandeln (z.B. 'March' -> 2)
      const monthIndex = new Date(
        Date.parse(date.month + " 1, 2020")
      ).getMonth();
      return year === date.year && month === monthIndex; // Jahr und Monat überprüfen
    }
  });

  filteredSports.forEach((sport) => {
    const { name, label } = sport;
    if (!sportCounts[name]) {
      sportCounts[name] = { count: 0, label };
    }
    sportCounts[name].count += 1;
  });

  // Umwandeln in ein Array und nach der Anzahl sortieren
  const sortedSports = Object.entries(sportCounts)
    .map(([name, { count, label }]) => ({ name, count, label }))
    .sort((a, b) => a.count - b.count); // Aufsteigend sortieren

  // Maximalen Wert finden
  //const maxCount = Math.max(...sortedSports.map((sport) => sport.count));


  const [maxCount, setMaxCount] = useState(null)

  useEffect(() => {
    if (date.month === "All") {
      setMaxCount(200);
    } else if (date.month != "All") {
      setMaxCount(31);
    }
  }, [date, sortedSports]);



  return (
    <div className={styles.container} id="container">
      <h1 className="text-xl py-2 flex items-center">Your Bar Chart for {date.year}, {date.month} <span className='text-xs mx-6 my-2'>(referred to number of units)</span> </h1>
      <div className=" flex px-4 my-2">
        <SelectTimePeriod  showBarChart={showBarChart} date={date} setDate={setDate} />
      </div> 

      <div className={styles.bar_chart} id="barChart">

        {sortedSports.map(({ name, count, label }) => (
          <div
            key={name}
            className={`${styles.bar} ${styles[label]}`}
            style={{ height: `${(count / maxCount) * 100}vh` }}
          >
            <h1 className={styles.barChart_titles}>
              {name}
            </h1>
            <p className='text-zinc-600'> {count}x </p>


          </div>
        ))}
      </div>
     
    </div>
  );
};

export default BarChart;