import Link from 'next/link';
import React from 'react';
import styles from './Plans.module.css'


const EditEntryField = React.memo(({ addSportHandler, addSportBtnText }) => {
  return (
      <div>
          <div className="flex justify-center border-b-2 h-16 items-center relative">
              <button className={styles.addSport_btn} onClick={addSportHandler}>
                  {addSportBtnText}
              </button>
              <Link href="/" className={styles.home_link}>
                  HOME
              </Link>
          </div>
      </div>
  );
});

export default EditEntryField;