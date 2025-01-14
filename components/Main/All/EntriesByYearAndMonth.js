import { useState} from 'react';
import Link from 'next/link';
import styles from '../Entry.module.css'
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
  const {convertMinutesToHours} = useConvertTimes()
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
    <div className=' w-full'>
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
                            <div key={monthName} className=' my-2'>
                   
                               
             

                                
                                <button
                                    className={styles.monthYear_header}
                                    onClick={() => toggleMonthEntries(monthName, year)}
                                >
                                    <p className={styles.monthYear_header_p}>
                                        {monthName} {year}
                                    </p>
                                    <p className={styles.monthYear_header_span}>
                                        (total hours of sport:
                                        <span className={styles.totalDuration}>
                                            {convertMinutesToHours(totalDuration)}
                                        </span>
                                        )
                                    </p>
                                </button>

                                {openMonths[`${monthName}-${year}`] && entries.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).map((entry, index) => (
                                    <div className={styles.entry} key={index} style={{ background: getComputedStyle(document.documentElement).getPropertyValue(`--${entry.label}`), }}>
                                        <Link href={`/details/${entry.entryPath}`}>
                                            <div className={styles.link}>
                                                <p className="my-2 text-xs absolute right-2">
                                                    {formatDate(entry.created_at)}
                                                </p>
                                                <p className="my-2 px-2 text-xs absolute right-4 top-6">
                                                    {convertMinutesToHours(entry.duration)}
                                                </p>
                                                <h2 className="text-2xl mb-4 mt-0 w-8/12 px-2">
                                                    {entry.title}
                                                </h2>
                                                <p className="px-2 mb-4">{entry.entry}</p>
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