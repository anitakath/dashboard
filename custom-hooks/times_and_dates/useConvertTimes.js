


const useConvertTimes = () =>{



    const convertMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} h ${remainingMinutes} min`;
    };

    const convertHoursToMinutes = (hours) =>{

    }



    return{ convertMinutesToHours, convertHoursToMinutes}
}


export default useConvertTimes
