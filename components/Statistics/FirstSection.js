
import { useSelector } from "react-redux";
import useStatistics from "@/custom-hooks/useStatistics";

const FirstSection = ({currentYear, formatDate,}) =>{
    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)
    const { totalDuration, totalEntries, averageDuration,  activeDays, inactiveDays, averageDurationPerDay, longestStreak } = useStatistics(allSupabaseSports, currentYear)
    
    
    return(
        <div className="flex flex-col justify-center items-center"> 
        <h1 className="text-xl">   in {currentYear} you have completed: </h1>

          <div className="flex flex-col items-center w-11/12 my-3 p-4 shadow-sm bg-red-50">
    
            <p className="font-semibold text-red-700 text-xl my-2">{totalDuration}</p>
            <h1 className="text-lg text-gray-700"> hours of sport </h1>
          </div>

          <div className="flex flex-col items-center w-11/12 my-3 p-4 shadow-sm bg-red-50">
            <p className="font-semibold text-red-700 text-xl my-2">{totalEntries}</p>
            <h1 className="text-lg text-gray-700"> sports units </h1>
          </div>

          <div className="flex flex-col items-center w-11/12 my-3 p-4  shadow-sm bg-red-50">

            <p className="font-semibold text-red-700 text-xl my-2">{averageDurationPerDay}</p>
            <h1 className="text-lg text-gray-700"> average hours of sport per day </h1>
          </div>

          <div className="flex justify-center items-center w-11/12 my-3 p-4 shadow-sm bg-red-50">
            <div className="mx-6 flex flex-col items-center justify-center">
              <p className="font-semibold text-red-700 text-xl my-2"> {activeDays} </p>
              <h1 className="text-lg text-gray-700"> active sports days</h1>
            </div>
            <div className="mx-6 flex flex-col justify-center items-center">
              
              <p className="font-semibold text-red-700 text-xl my-2"> {inactiveDays} </p>
              <h1 className="text-lg text-gray-700"> rest days</h1>
            </div>
          </div>

          <div className="flex flex-col items-center w-11/12 my-3 p-4  shadow-sm bg-red-50">

            <p className="font-semibold text-red-700 text-xl my-2">  {longestStreak.length} </p>
            <h1 className="text-lg text-gray-700"> days of sport in a row </h1>
          
            <p className="text-xs my-2"> there was no day of rest between {formatDate(longestStreak.from)} and {formatDate(longestStreak.to)} </p>
          </div>

        </div>
    )
}

export default FirstSection