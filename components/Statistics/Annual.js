
import styles from './Annual.module.css'


const Annual = ({ allSupabaseSports }) => {


  // Schritt 1: Zähle die Vorkommen jeder Sportart und speichere das Label
  const sportCount = allSupabaseSports.reduce((acc, sport) => {
    if (!acc[sport.name]) {
      acc[sport.name] = { count: 0, label: sport.label }; // Speichere das Label beim ersten Auftreten
    }
    acc[sport.name].count += 1; // Zähle die Vorkommen
    return acc;
  }, {});

  // Schritt 2: Sortiere die Sportarten nach der Häufigkeit
  const sortedSports = Object.entries(sportCount)
    .sort((a, b) => b[1].count - a[1].count) // Sortiere absteigend nach der Anzahl
    .slice(0, 3); // Nimm nur die Top 3


  return (
    <div>
      <div className="flex my-2">
        <h1 className="text-2xl w-full flex justify-center items-center ">
          your favourite sports in ... ( NOCH NICHT JÄHRLICH!!!! allsupabasesports nimmt auch die Objekte aus 2023 und Co auf!)
        </h1>
        <div className="w-full">
          {sortedSports.map(([name, { count, label }], index) => (
            <div
              key={name}
              className={`${styles[label]} ${styles.fav_sports_div}`}
            >
              {index + 1}. {name}, {count}x {label}
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 flex my-2 overflow-scroll">
        <h1 className="text-center w-full">Total hours per sport ...</h1>
        <div className="h-20 bg-red-200 w-full">
          -Show the total number of hours spent on each sport per year / per
          month
          <br /> <br />
          -Calculate the average duration of training sessions for each sport
          and in total.
        </div>
      </div>

      <div className="border-2 flex my-2 ">
        <h1 className="text-center w-full">Rest days ... </h1>
        <div className="h-20 bg-red-200 w-full">
          Show the total number of hours rest days ... active (sauna) passive
          (no entries)
        </div>
      </div>
    </div>
  );
};

export default Annual