


const useConvertTimes = () =>{


    const convertMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} h ${remainingMinutes} min`;
    };

    const convertHoursToMinutes = (hours) =>{
        return hours * 60;
    }

    const averageDurationPerDay = (totalDuration) => {
        const totalMinutes = totalDuration;

        const currentDate = new Date();

        const currentDayOfMonth = currentDate.getDate(); 

        const averageMinutesPerDay = totalMinutes / currentDayOfMonth;

  
        const roundedAverageMinutesPerDay = Math.floor(averageMinutesPerDay)

        return convertMinutesToHours(roundedAverageMinutesPerDay);
    };



    return{ convertMinutesToHours, convertHoursToMinutes, averageDurationPerDay}
}


export default useConvertTimes
