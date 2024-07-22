import Link from 'next/link';
//STYLES 
import styles from './Plans.module.css'
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const Plans = () =>{


    return (
      <div className="">
        <div className={`h-20 border-2 p-2 flex justify-evenly ${styles.container}`}>
          <div className="m-2"> go left go right</div>
          <div className="m-2"> week X </div>
          <div className="m-2">
            <Link href="/"> <FontAwesomeIcon icon={faHouse} /></Link>
          </div>
        </div>

        <div className={`h-80 border-2 p-2 ${styles.container}`}>
          weekly-calendar
        </div>
      </div>
    );
}

export default Plans