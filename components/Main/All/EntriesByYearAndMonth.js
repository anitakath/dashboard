import { useState} from 'react';
import Link from 'next/link';
import styles from './EntriesByYearAndMonth.module.css'
//CUSTOM HOOKS
import useFormatDate from '@/custom-hooks/times_and_dates/useFormatDate';
import useConvertTimes from '@/custom-hooks/times_and_dates/useConvertTimes';
import { useSelector, useDispatch } from 'react-redux';
import useFetchEntries from '@/custom-hooks/entries/useFetchEntries';
import { updateDate } from '@/store/CalendarReducer';
import { setAllSportsFromSupabase } from '@/store/sportReducer';
//UI 
import Spinner from '@/components/UI/Spinner';


const EntriesByYearAndMonth = ({  entriesByYearAndMonth, currentSport }) =>{
  const calendar = useSelector((state) => state.calendar)
  const [openMonths, setOpenMonths] = useState({});
  const [openYear, setOpenYear] = useState(calendar.year)
  const years = [2024, 2025];
  const userId = useSelector((state) => state.auth.userId)
  const dispatch = useDispatch();
  const {fetchSportsDataBySelectedYear} = useFetchEntries()
  const {convertMinutesToHours, averageDurationPerDay} = useConvertTimes()
  const {formatDate} = useFormatDate()
  const toggleMonthEntries = (monthName, year) => {
    const monthYearKey = `${monthName}-${year}`;
    setOpenMonths((prevState) => ({
        ...prevState,
        [monthYearKey]: !prevState[monthYearKey], 
      }));
  };
  const [isLoading, setIsLoading] = useState(false)


  const handleYearChange = async (year) => {
    setIsLoading(true)
    dispatch(updateDate({ month: calendar.month, year }));
    const entries = await fetchSportsDataBySelectedYear(userId, year)
    await dispatch(setAllSportsFromSupabase(entries));
    setOpenYear(parseInt(year))
    setIsLoading(false)
  };



  return (
    <div className='w-full border-8'>
        {isLoading && (
            <div className='h-screen w-full m-0'>
                <div className='w-full h-60'>
                    <Spinner text="loading"/> 
                </div>
            </div>
        )}

        {years.slice().reverse().map((year) => {
            // Überprüfen, ob das Jahr in entriesByYearAndMonth vorhanden ist
            const yearEntry = entriesByYearAndMonth ?  entriesByYearAndMonth.find(entry => Object.keys(entry)[0] === year.toString()) : "";
            const months = yearEntry ? yearEntry[year] : [];

            return (
                <div key={year}>

                    <button
                        className={`${styles.yearHeader} ${parseInt(year) === openYear ? styles.yearHeaderActive : ''}`}
                        onClick={() => handleYearChange(year)}
                    >
                        {year}
                    </button>

             

                    {months.length > 0 && parseInt(year) === openYear && currentSport === "all" && months.map((monthEntry) => {
                        const monthName = Object.keys(monthEntry)[0];
                        const entries = monthEntry[monthName];
                        const totalDuration = entries.reduce(
                            (acc, entry) => acc + entry.duration,
                            0
                        );

                        return (
                            <div key={monthName} className='border-8'>

                                <div className='w-full p-0 h-20 flex justify-center items-center'>
                                
                                    <button
                                        className={styles.monthBtn}
                                        onClick={() => toggleMonthEntries(monthName, year)}
                                    >
                                        <span className='mx-2 lg:mx-4' style={{fontSize: "0.9rem"}}> {monthName}  </span> 
                                        <div className={styles.durationDiv}>
                                            <span className={styles.totalDuration}>
                                                total hours of sport:  <strong> {convertMinutesToHours(totalDuration)} </strong>
                                            </span>
                                            <span className={styles.averageDuration}> 
                                                average hours of sport per day:  <strong>{averageDurationPerDay(totalDuration, monthName)} </strong>
                                            </span>
                                        
                                        </div>
                                       
                                    </button>
                                </div>

                                {openMonths[`${monthName}-${year}`] && entries.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).map((entry, index) => (
                                    <div className={styles.entry} key={index} style={{ background: getComputedStyle(document.documentElement).getPropertyValue(`--${entry.label}`), }}>
                                        <Link href={`/details/${entry.entryPath}`}>
                                            <div className={styles.linkDiv}>
                                                <div className={styles.linkPararaphDiv}>
                                                    <p className={styles.linkParagraphDate}>
                                                        {formatDate(entry.created_at)}
                                                    </p>
                                                    <p className={styles.linkParagraphDuration}>
                                                        {convertMinutesToHours(entry.duration)}
                                                    </p>
                                                </div>
                                                
                                                <h2 className={styles.linkTitle}>
                                                    {entry.title}
                                                </h2>
                                                <p className={styles.linkEntry}>{entry.entry}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            );
        })}
    </div>
);
}

export default EntriesByYearAndMonth