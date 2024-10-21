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
  const filteredEntries = useSelector((state) => state.sport.filteredEntriesByCurrentSport)

  return (
    <div className="w-full h-full sm:p-4 " id="top">
      <div className="flex w-full h-full sm:border-2 py-2 m-0 p-0 relative ">
        <div className="border-r w-3/12 p-0 flex flex-col overflow-scroll items-center shadow-section hidden lg:flex">
          <Navigation />
        </div>

        <Board
          filteredEntries={filteredEntries}
        />
      </div>
    </div>
  );
}

export default Dashboard
