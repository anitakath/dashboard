import Link from "next/link";
import styles from './SummarizedEntries.module.css'
import colors from '../../../styles/Colors.module.css'
import Calendar from "../Calendar";
//REDUX
import { useSelector } from "react-redux";
//CUSTOM HOOKS
import useCalendar from "../../../custom-hooks/times_and_dates/useCalendar";
//COMPONENTS
import QuotesSlider from "@/components/UI/QuotesSlider";

const SummarizedCalendar = (props) => {
    const filteredAndGroupedEntries = props.filteredAndGroupedEntries;

    const renderCalendar = () => {

    const calendar = useSelector((state) => state.calendar)
    const selectedYear = calendar.year;
    const {getMonthsDays} = useCalendar();
    const monthsInYear = getMonthsDays(calendar);
    const chosenMonth = useSelector((state) => state.calendar.month);
    const {monthAbbreviations} = useCalendar()
    const  allPlannedSports = useSelector((state) => state.sport.allPlannedSports)

    
    return (
        <div className={styles.calendar_div}>
            <div className={styles.calendarDiv}>
                <Calendar />
            </div>
            <div className={styles.quotesDiv}>
                <QuotesSlider/>
            </div>
            <div className={styles.placeholdersDiv}>
                <h1 className="font_meowScript text-2xl text-amber-400 animate-zoom-in"> ✨another placeholder✨ </h1>
            </div>


              {monthsInYear.map((month, monthIndex) => {
                  // Überprüfen, ob der aktuelle Monat aktiv ist
                  const isActiveMonth = month.name === monthAbbreviations[chosenMonth];

                  return (
                      <div key={month.name} className={`${styles.month} ${isActiveMonth ? styles.activeMonth : ""}`} id={month.name}>
                          <h3 className={styles.title}>{month.name}</h3>
                          <div className={styles.days}>
                              {[...Array(month.days)].map((_, dayIndex) => {
                                  const dayNumber = dayIndex + 1;
                                  const date = new Date(calendar.year, monthIndex, dayNumber); 
                                  date.setDate(date.getDate() + 1); 
                                  const dateString = date.toISOString().split("T")[0];
                        
                                  const isToday = new Date().toISOString().split("T")[0] === dateString;

                                  

                                    return (
                                      <div key={dayNumber} className={`${styles.day} ${isToday ? styles.today : ""}`}>
                                          <Link className={styles.day_date} href={`/daily-details/${dateString}`}>
                                              {dayNumber} 
                                          </Link>
                                          <div className={styles.sport_subsection}>
                                              {(filteredAndGroupedEntries[dateString] || []).map((entry) => {
                                                const entryDate = new Date(entry.created_at).toISOString().split("T")[0];
                                                const isEntryDate = dateString === entryDate;
                            
                                                // Alternativ:
                                                const entryYear = entry.created_at.split("-")[0]; 

                            
                                                if (entryYear != selectedYear) {
                                                    return null; // Wenn das Jahr nicht übereinstimmt, nichts rendern
                                                }
                                                // Berechnung der Höhe des Markers basierend auf der Dauer
                                                const height = entry.duration < 20 ? "3px" : `${Math.floor(entry.duration / 20) * 5}px`;
                                                const entryClass = colors[`${entry.label}_opaque`] || styles.defaultLabel;
                            
                                                console.log(entryClass)

                                                  return (
                                                      <div key={entry.entryId} className={`${styles.sport_subsectionLabel} ${entryClass}`} style={{ height }}> </div>
                                                  );
                                              })}


                                                {allPlannedSports && allPlannedSports.filter(sport => {
                                                        const sportDate = new Date(sport.created_at).toISOString().split("T")[0];
                                                        return sportDate === dateString && sportDate >= new Date().toISOString().split("T")[0]; // Nur zukünftige Sporteinheiten für den aktuellen Tag
                                                    }).map((plannedSport) => {
                                                        const plannedHeight = plannedSport.duration < 20 ? "3px" : `${Math.floor(plannedSport.duration / 20) * 5}px`;

                                                        const plannedEntryClass = colors[`${plannedSport.label}_opaque_planned`] || styles.defaultLabel;

                                                      return (
                                                        <div key={plannedSport.entryId} className={`${styles.sport_subsectionLabel} ${plannedEntryClass}`} style={{ height: plannedHeight}}>
                                                        
                                                        </div>
                                                        );
                                                })}
                                             
                                          </div>
                                      </div>
                                    );
                              })}
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  return (
      <div>
          {renderCalendar()}
      </div>
  );
};

export default SummarizedCalendar;

