
import { useSelector } from "react-redux"
import useSortedEntriesByMonth from "@/custom-hooks/useSortedEntriesByMonth";


const SportsGrafic= (props) =>{
  const setShowGrafic = props.setShowGrafic;
  const showGrafic = props.showGrafic;
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );

  /* Funktion zum Filtern der Objekte nach Monat
  
    return sportsArray.filter((sport) => {
      const createdAtDate = new Date(sport.created_at);
      const options = { month: "long" }; // 'long' gibt den vollständigen Monatsnamen zurück
      const monthName = createdAtDate.toLocaleString("en-US", options); // Monat auf Englisch

      console.log(`Created At: ${createdAtDate}, Month Name: ${monthName}`); // Debugging-Ausgabe

      return monthName === month; // Vergleiche mit dem übergebenen Monat
    });
  };
  */

const getUniqueMonths = (sportsArray) => {
  const months = new Set();

  sportsArray.forEach((item) => {
    const date = new Date(item.created_at);
    const month = date.toLocaleString("en-US", { month: "long" });
    months.add(month);
  });

  return Array.from(months);
};

const uniqueMonths = getUniqueMonths(allSupabaseSports);

//console.log(uniqueMonths)

  /*
  Gefilterte Sportobjekte für den angegebenen Monat
  const filteredSports = filterByMonth(allSupabaseSports, showGrafic);
  */


  //console.log(showGrafic);
  //console.log(allSupabaseSports);
  return (
    <div className="border-2 h-80 p-2 my-2">
      <div className="flex justify-between p-2">
        <h1> sports grafic </h1>
        <button> close </button>
      </div>

      <div>grafic field</div>
    </div>
  );
}

export default SportsGrafic;