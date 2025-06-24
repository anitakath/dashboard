
import { useState } from 'react';
import styles from './SelectTimePeriod.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { setAllSportsFromSupabase } from '@/store/sportReducer';
//CUSTOM HOOKS
import { useHandleYearChange,  useHandleMonthChange } from '@/custom-hooks/times_and_dates/useDateChange';
import useFetchEntries from '@/custom-hooks/entries/useFetchEntries';
//COMPONENTS
import Spinner from '@/components/UI/Spinner';

const SelectTimePeriod = ({date, setDate, showBarChart}) =>{
  const currentYear = new Date().getFullYear();
  const userId = useSelector((state) => state.auth.userId)
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [selectedYear, handleYearChange] = useHandleYearChange(currentYear);
  const [selectedMonth, handleMonthChange] = useHandleMonthChange(currentMonth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const currentDate = useSelector((state) => state.calendar)

  const {fetchSportsDataBySelectedYear} = useFetchEntries();
  const years = Array.from(
    { length: 10 },
    (_, i) => 2023 + i
  );


  // Neue Funktion zum Ändern des Jahres und Abrufen der Einträge
  const changeYearAndFetchEntriesHandler = async (year) => {
    setIsLoading(true)
    try{
      // change year and refetch entries, based on the new date
      
      // Jahr ändern
      await handleYearChange(year, setIsYearModalOpen, setDate);
      // Daten abrufen
      const entriesInSelectedYear = await fetchSportsDataBySelectedYear(userId, year);
      await dispatch(setAllSportsFromSupabase(entriesInSelectedYear))
      setIsLoading(false)
    }catch{
      console.error('could not change year and refetch statistics entries')
      setIsLoading(false)
    }
  }; 


  return (
      <div className="flex-col border-8 lg:flex-row md:h-auto justify-center items-center relative w-full ">
        {!isYearModalOpen && !isMonthModalOpen && (
          <button
          className="secondary_button"
          onClick={() => setIsYearModalOpen(true)}
        >
          select year
        </button>)}

        {isLoading && (
          <div className='absolute top-0 left-0 w-full h-full bg-white flex-col   justify-center items-center'>
            <Spinner text="loading statistics data.."/>
          </div>
        )}
     
       
        {showBarChart !== "XUNITS" && showBarChart !== "XTIMES"  &&  !isYearModalOpen &&(
           <p className="my-4  lg:my-0">
           <span className={styles.selected_span}>currently selected:</span>
           {selectedYear} {/* , {selectedMonth} */}
         </p>
        )}
       

        {/* Year Modal */}
        {isYearModalOpen && (
          <div className={styles.year_modal}>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => changeYearAndFetchEntriesHandler(year)}
                className={styles.year}
              >
                {year} 
              </button>
            ))}
            <button
              onClick={() => setIsYearModalOpen(false)}
              className={styles.close_btn}
            >
              Close
            </button>
          </div>
        )}
        {/* Month Modal */}
        {isMonthModalOpen && (
          <div className={styles.month_modal}>
            <button
              onClick={() => setIsMonthModalOpen(false)}
              className={styles.close_btn}
            >
              Close
            </button>
            
          </div>
        )}
      </div>
    );
}

export default SelectTimePeriod