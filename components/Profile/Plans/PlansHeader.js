
import styles from './PlansHeader.module.css'

const PlansHeader = ({toggleAllEntries, areAllOpen}) =>{


    return (
      <div className='w-full flex-col  relative flex items-center'>
        <p className={styles.yourEntried_p}> your entries 🐣 </p>
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