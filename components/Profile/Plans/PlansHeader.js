
import styles from './PlansHeader.module.css'

const PlansHeader = ({toggleAllEntries, areAllOpen}) =>{


    return (
      <div className='w-full flex items-center'>
        <p className="text-xl my-4 mb-6 mx-14"> your entries </p>
        <button
          onClick={toggleAllEntries}
          className={`${styles.toggleEntries_btn} ${
            areAllOpen === true
              ? styles.toggleEntries_btn_open
              : styles.toggleEntries_btn_closed
          }`}
        >
          {areAllOpen ? "Close all entries" : "Open all entries"}
        </button>
      </div>
    );
}

export default PlansHeader