import { useSelector } from "react-redux";
import useCalendar from "./useCalendar";

const useConvertTimes = () =>{


    const convertMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} h ${remainingMinutes} min`;
    };

    const convertHoursToMinutes = (hours) =>{
        return hours * 60;
    }


    const {completeMonths,  getMonthsDays} = useCalendar();
    const calendar = useSelector((state) => state.calendar)


    const averageDurationPerDay = (totalDuration, monthName) => {

        const currentDate = new Date();
        const currentDayOfMonth = currentDate.getDate(); 
        const currentMonthOfYear = currentDate.getMonth();
        const monthsDays = getMonthsDays(calendar);
        const monthData = monthsDays.find(month => month.name.toUpperCase() === monthName.toUpperCase());

        if (!monthData) {
            console.error(`Monat ${monthName} nicht gefunden.`);
            return null;
        }

        let averageMinutesPerDay;
         // current month
        if (monthName === completeMonths[currentMonthOfYear]) {
            averageMinutesPerDay = totalDuration / currentDayOfMonth;
        } else {
         // previous months
            averageMinutesPerDay = totalDuration / monthData.days;
        }

        const roundedAverageMinutesPerDay = Math.floor(averageMinutesPerDay);

        return convertMinutesToHours(roundedAverageMinutesPerDay);
    };



    return{convertMinutesToHours, convertHoursToMinutes, averageDurationPerDay}
}


export default useConvertTimes
