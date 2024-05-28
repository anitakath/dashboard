//STYLES
import styles from './Dashboard.module.css'


//COMPONENTS
import Navigation from '../Navigation/Navigation';
import Board from '../Main/Board'

//REDUX
import { useSelector, useDispatch } from "react-redux";



const Dashboard = () =>{


  const currentSport = useSelector((state) => state.sport.selectedSport);

  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );

  const filteredEntries = allSupabaseSports.filter(sport => sport.name === currentSport)



    return (
      <div className="w-full h-full p-4">
        <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative">
          <Navigation />
          <Board
            filteredEntries={filteredEntries}
            currentSport={currentSport}
          />
        </div>
      </div>
    ); 
}

export default Dashboard
