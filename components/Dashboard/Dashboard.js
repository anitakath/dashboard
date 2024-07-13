//STYLES
import styles from './Dashboard.module.css'
import { useEffect, useState } from 'react';

//COMPONENTS
import Navigation from '../Navigation/Navigation';
import MobileNavigation from '../Navigation/MobileNavigation';
import Board from '../Main/Board'
//HOOKS
import { convertMinutesToHours } from '@/custom-hooks/minutesToHours';
//REDUX
import { useSelector, useDispatch } from "react-redux";

const Dashboard = () =>{
  
  const [filteredEntries, setFilteredEntries] = useState([])

  const currentDate = useSelector((state) => state.calendar);
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const entries = allSupabaseSports
    ? allSupabaseSports.filter((sport) => sport.name === currentSport)
    : [];

  const [sportsDurationByMonth, setSportsDurationByMonth] = useState(null)
  
    useEffect(() => {
      if (entries) {
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
    }, [allSupabaseSports, currentDate, currentSport]);

    const getMonthNumber = (month) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(month) + 1;
    };





  return (
    <div className="w-full h-full p-4">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative">
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
