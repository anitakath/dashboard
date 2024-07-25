import Link from 'next/link';
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse} from "@fortawesome/free-solid-svg-icons";
import styles from './Plans.module.css'

const EditEntryField = ({addSportHandler, addSportBtnText}) =>{

    return (
      <div>
        <div className="flex justify-center h-16 items-center relative">
          <button className={styles.addSport_btn} onClick={addSportHandler}>
            {addSportBtnText}
          </button>
          <Link href="/" className={styles.home_link}>
            <FontAwesomeIcon icon={faHouse} />
          </Link>
        </div>
      </div>
    );
}

export default EditEntryField