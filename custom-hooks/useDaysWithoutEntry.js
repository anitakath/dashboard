


import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRestDays} from "@/store/CalendarReducer";

const useDaysWithoutEntry = (entriesByMonth) => {

  const dispatch =  useDispatch();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Monate sind 0-basiert
  const currentYear = currentDate.getFullYear();
  const today = currentDate.getDate();

  const [daysInMonth, setDaysInMonth] = useState([]);
  const [todayDate, setTodayDate] = useState(new Date());



  // get the days of each month of the year
  useEffect(() => {
    const getDaysInMonth = () => {
      const daysInYear = [];
      for (let month = 1; month <= 12; month++) {
        const days = new Date(new Date().getFullYear(), month, 0).getDate();
        const monthName = new Date(
          new Date().getFullYear(),
          month - 1,
          1
        ).toLocaleString("en-US", { month: "long" });
        daysInYear.push({ month: monthName, days: days });
      }
      setDaysInMonth(daysInYear);
    };

    getDaysInMonth();
  }, []);

  const [activeDaysPerMonth, setActiveDaysPerMonth] = useState({});
  const [restDaysPerMonth, setRestDaysPerMonth] = useState(0);

  useEffect(() => {
    const countActiveDays = () => {
      const activeDays = {};

      for (const month in entriesByMonth) {
        const uniqueDates = new Set();

        entriesByMonth[month].forEach((entry) => {
          const date = new Date(entry.created_at).toDateString();
          uniqueDates.add(date);
        });

        activeDays[month] = uniqueDates.size;
  
      }
      setActiveDaysPerMonth(activeDays);


    };


    
    countActiveDays();

  }, [daysInMonth]);



    useEffect(() => {

      const countRestDays = async () => {


        const activeDaysArray = Object.entries(activeDaysPerMonth).map(
          ([month, days]) => {
            return { month: month.trim(), days };
          }
        );
        const restDayArray = daysInMonth.map((month) => {
          const activeMonth = activeDaysArray.find(
            (activeMonth) => activeMonth.month === month.month
          );

          if (activeMonth) {
            return {
              month: month.month,
              days: month.days - activeMonth.days,
            };
          } else {
            return {
              month: month.month,
              days: month.days,
            };
          }
        });



        const restDayObject = restDayArray.reduce((acc, curr) => {
          acc[curr.month] = curr.days;
          return acc;
        }, {});

        setRestDaysPerMonth(restDayObject);
        dispatch(setRestDays(restDayObject));
      };

      countRestDays()

    }, [activeDaysPerMonth]);


  return { daysInMonth, todayDate, activeDaysPerMonth, restDaysPerMonth };
};

export default useDaysWithoutEntry;
