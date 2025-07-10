

const usePlannedSports = () =>{


    const getTimeSlot = (date) => {
        const hour = date.getHours();
        if (hour >= 5 && hour <= 13) return "morning";
        if (hour >= 14 && hour <= 17) return "afternoon";
        return "evening"; // 18–04 Uhr
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];



    return{getTimeSlot, daysOfWeek, weekdays}

}

export default usePlannedSports