
import { useState } from 'react';

import styles from './SelectTimePeriod.module.css'


const SelectTimePeriod = () =>{

     const currentYear = new Date().getFullYear();
     const currentMonth = new Date().toLocaleString("default", {
       month: "long",
     });

     const [selectedYear, setSelectedYear] = useState(currentYear);
     const [selectedMonth, setSelectedMonth] = useState(currentMonth);
     const [isYearModalOpen, setIsYearModalOpen] = useState(false);
     const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);


    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];


    return (
      <div className='flex items-center relative w-full '>
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
          current year && all months
        </p>

        {/* Year Modal */}
        {isYearModalOpen && (
          <div className={styles.modal}>
            <h2>Select a Year</h2>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year);
                  setIsYearModalOpen(false);
                }}
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
          <div className={styles.modal}>
            <h2>Select a Month</h2>
            {months.map((month) => (
              <button
                key={month}
                onClick={() => {
                  setSelectedMonth(month);
                  setIsMonthModalOpen(false);
                }}
              >
                {month}
              </button>
            ))}
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