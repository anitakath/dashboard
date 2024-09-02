
import { useState } from 'react';
import styles from './SelectTimePeriod.module.css'

//CUSTOM HOOKS
import { useHandleYearChange,  useHandleMonthChange } from '@/custom-hooks/useDate';
import { completeMonths } from '@/custom-hooks/useCalendar';

const SelectTimePeriod = ({date, setDate}) =>{

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

  // Verwende die Custom Hooks
  const [selectedYear, handleYearChange] = useHandleYearChange(currentYear);
  const [selectedMonth, handleMonthChange] = useHandleMonthChange(currentMonth);

  const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  );

  console.log(date);

  return (
      <div className="flex flex-col lg:flex-row h-60 md:h-40 justify-center items-center relative w-full ">
        <button
          className="secondary_button"
          onClick={() => setIsYearModalOpen(true)}
        >
          select year
        </button>
        <button
          className="secondary_button"
          onClick={() => setIsMonthModalOpen(true)}
        >
          select month
        </button>
        <p className="mx-4 my-4 lg:my-0">
          <span className={styles.selected_span}>currently selected:</span>
          {selectedYear}, {selectedMonth}
        </p>

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
            {completeMonths.map((month) => (
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