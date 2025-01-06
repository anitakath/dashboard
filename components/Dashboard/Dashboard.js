//STYLES
import { useEffect } from 'react';
//COMPONENTS
import Navigation from '../Navigation/Navigation';
import Board from '../Main/Board'
//REDUX
import { useSelector } from "react-redux";
//CUSTOM HOOKS
import useFilterAndSortEntries from '@/custom-hooks/entries/useFilterAndSortEntries';


const Dashboard = () =>{
  const filteredEntriesByUserId = useSelector((state) => state.sport.allSupabaseSports)
  const currentSport = useSelector((state) => state.sport.selectedSport)
  const currentDate = useSelector((state) => state.calendar)

  const { filterEntriesByCurrentSportAndDate} = useFilterAndSortEntries();

  useEffect(() => {
    // refetching entries of sport X bc user changed the date
    if (filteredEntriesByUserId && currentSport && currentDate) {
       filterEntriesByCurrentSportAndDate(
        filteredEntriesByUserId,
        currentSport,
        currentDate
      );

    }
  }, [currentDate, filteredEntriesByUserId, currentSport]);


  return (
    <div className="w-full h-full sm:p-4 " id="top">
      <div className="flex w-full h-full sm:border-2 py-2 m-0 p-0 relative ">
        <div className="border-r w-3/12 p-0  flex-col overflow-scroll items-center shadow-section hidden lg:flex">
          <Navigation />
        </div>

        <Board/>
      </div>
    </div>
  );
}

export default Dashboard
