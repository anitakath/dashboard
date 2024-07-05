//STYLES
import styles from './Dashboard.module.css'


//COMPONENTS
import Navigation from '../Navigation/Navigation';
import MobileNavigation from '../Navigation/MobileNavigation';
import Board from '../Main/Board'

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { current } from '@reduxjs/toolkit';


import { v4 as uuidv4 } from "uuid";

const Dashboard = () =>{

  const currentSport = useSelector((state) => state.sport.selectedSport);
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const filteredEntries = allSupabaseSports
    ? allSupabaseSports.filter((sport) => sport.name === currentSport)
    : [];

  return (
    <div className="w-full h-full p-4">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative">
        <div className="border-r w-1/5 p-0 flex flex-col overflow-scroll items-center shadow-section hidden lg:flex">
          <Navigation />
        </div>

        <Board filteredEntries={filteredEntries} currentSport={currentSport} />
      </div>
    </div>
  );
}

export default Dashboard
