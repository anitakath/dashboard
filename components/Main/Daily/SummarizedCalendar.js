import { useState } from "react";
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

    const [selectedSport, setSelectedSport] = useState(""); // <- neuer State

    const renderCalendar = () => {
        const calendar = useSelector((state) => state.calendar)
        const selectedYear = calendar.year;
        const {getMonthsDays} = useCalendar();
        const monthsInYear = getMonthsDays(calendar);
        const chosenMonth = useSelector((state) => state.calendar.month);
        const {monthAbbreviations} = useCalendar()
        const  allPlannedSports = useSelector((state) => state.sport.allPlannedSports)
        const allSports = useSelector((state) => state.sport.currentSport)

        // Filterlogik: nur die Entries behalten, die zum ausgewählten Sport passen
        const filteredEntriesBySport = Object.fromEntries(
            Object.entries(filteredAndGroupedEntries).map(([date, entries]) => [
                date,
                selectedSport
                    ? entries.filter((entry) => entry.name === selectedSport)
                    : entries
            ])
        );

        return (
            <div className={styles.calendar_div}>
                <div className={styles.calendarDiv}>
                    <Calendar />
                </div>
                <div className={styles.quotesDiv}>
                    <QuotesSlider/>
                </div>
                <div className={styles.placeholdersDiv}>
                    <select
                        className="bg-white p-2 m-2"
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                    >
                        <option value="">-- Alle Sportarten --</option>
                        {allSports.map((sport) => (
                            <option key={sport.name} value={sport.name}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                </div>

                {monthsInYear.map((month, monthIndex) => {
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
                                                {(filteredEntriesBySport[dateString] || []).map((entry) => {
                                                    const entryYear = entry.created_at.split("-")[0]; 
                                                    if (entryYear != selectedYear) {
                                                        return null;
                                                    }

                                                    const height = entry.duration < 20 ? "3px" : `${Math.floor(entry.duration / 20) * 5}px`;
                                                    const entryClass = colors[`${entry.label}_opaque`] || styles.defaultLabel;
                                                    
                                                    return (
                                                        <div key={entry.entryId} className={`${styles.sport_subsectionLabel} ${entryClass}`} style={{ height }}> </div>
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
