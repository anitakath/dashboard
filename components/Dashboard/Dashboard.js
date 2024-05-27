//STYLES
import styles from './Dashboard.module.css'


//COMPONENTS
import Navigation from '../Navigation/Navigation';
import Board from '../Main/Board'

//REDUX
import { useSelector, useDispatch } from "react-redux";


const Dashboard = () =>{

  const allSports = useSelector((state) => state.sport.allSports);
  const currentSport = useSelector((state) => state.sport.selectedSport);

  console.log(allSports)
  console.log(currentSport)

    return (
      <div className="w-full h-full p-4">

        <div className='flex w-full h-full border-2 py-2 m-0 p-0 relative'>
          <Navigation />
          <Board currentSport={currentSport} allSports={allSports} />
        </div>
      </div>
    ); 
}

export default Dashboard
