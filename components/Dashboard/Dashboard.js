//STYLES
import { useEffect, useState } from 'react';
//COMPONENTS
import Navigation from '../Navigation/Navigation';
import Board from '../Main/Board'
//HOOKS
import { convertMinutesToHours } from '@/custom-hooks/minutesToHours';
import useAuth from '@/custom-hooks/auth/useAuth';
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport } from '@/store/sportReducer';


const Dashboard = () =>{
  const userId = useSelector((state) => state.auth.userId);
  const {fetchSportsData} = useAuth(userId)
  const [filteredEntries, setFilteredEntries] = useState([])
  const currentDate = useSelector((state) => state.calendar);
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const entries = allSupabaseSports
    ? allSupabaseSports.filter((sport) => sport.name === currentSport)
    : [];

  const [sportsDurationByMonth, setSportsDurationByMonth] = useState(null)
  const dispatch= useDispatch();


  useEffect(() => {
    const getFilteredSportsData = async () => {
      const filteredData = await fetchSportsData(userId);
  
      if(filteredData){
          
       const entries = filteredData.filter((sport) => sport.name === currentSport);

       const filterEntries = entries.filter((entry) => {
         const entryDate = new Date(entry.created_at);
         return (
           entryDate.getFullYear() === currentDate.year &&
           entryDate.getMonth() + 1 === getMonthNumber(currentDate.month)
         );
       });
        const totalDurationInMinutes = filterEntries.reduce(
          (total, entry) => total + entry.duration,
          0
        );
        const totalDurationInHours = convertMinutesToHours(
          totalDurationInMinutes
        );
        setSportsDurationByMonth(totalDurationInHours);
        setFilteredEntries(filterEntries);
      }
    };
    if (userId) {
      getFilteredSportsData();
    }
  }, [ userId, currentDate, currentSport, allSupabaseSports]);
  

    const getMonthNumber = (month) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(month) + 1;
    };



  return (
    <div className="w-full h-full sm:p-4 " id="top">
      <div className="flex w-full h-full sm:border-2 py-2 m-0 p-0 relative ">
        <div className="border-r w-1/5 p-0 flex flex-col overflow-scroll items-center shadow-section hidden lg:flex">
          <Navigation />
        </div>

        <Board
          filteredEntries={filteredEntries}
          sportsDurationByMonth={sportsDurationByMonth}
        />
      </div>
    </div>
  );
}

export default Dashboard
