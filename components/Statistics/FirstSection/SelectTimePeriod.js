
import { useState } from 'react';
import styles from './SelectTimePeriod.module.css'

//CUSTOM HOOKS
import { useHandleYearChange,  useHandleMonthChange } from '@/custom-hooks/times_and_dates/useDateChange';
import useCalendar  from "@/custom-hooks/times_and_dates/useCalendar";


const SelectTimePeriod = ({date, setDate, showBarChart}) =>{
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [selectedYear, handleYearChange] = useHandleYearChange(currentYear);
  const [selectedMonth, handleMonthChange] = useHandleMonthChange(currentMonth);

  const years = Array.from(
    { length: 10 },
    (_, i) => 2023 + i
  );
  const {completeMonths} = useCalendar();


  return (
      <div className="flex  flex-col lg:flex-row h-60 md:h-auto justify-center items-center relative w-full ">
        {!isYearModalOpen && !isMonthModalOpen && (
          <button
          className="secondary_button"
          onClick={() => setIsYearModalOpen(true)}
        >
          select year
        </button>)}

        {/*
         ----------------------------------------------------------- 
         IF WE WANT TO OFFER THE USER NOT ONLY ANNUAL, BUT ALSO MONTHLY STATISTICS
         -----------------------------------------------------------
          {!isYearModalOpen && !isMonthModalOpen && (
            <button
            className="secondary_button"
            onClick={() => setIsMonthModalOpen(true)}
          >
            select month
          </button>
          )} 
        */}
       
        {showBarChart !== "XUNITS" && showBarChart !== "XTIMES"  && (
           <p className="my-4 lg:my-0">
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
                onClick={() => handleYearChange(year, setIsYearModalOpen, setDate)}
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
            {completeMonths && completeMonths.map((month) => (
              <button
                key={month}
                onClick={() =>handleMonthChange(month, setIsMonthModalOpen, setDate)}
                className={styles.month}
              >
                {month} 
              </button>
            ))}
          </div>
        )}
      </div>
    );
}

export default SelectTimePeriod