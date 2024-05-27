//STYLES
import styles from './Dashboard.module.css'


//COMPONENTS
import Navigation from '../Navigation/Navigation';
import Board from '../Main/Board'


const Dashboard = () =>{

    return (
      <div className="w-full h-full p-4 border-4">

        <div className='flex w-full h-full border-8 m-0 p-0 relative'>
          <Navigation />
          <Board/>
        </div>
      </div>
    ); 
}

export default Dashboard
