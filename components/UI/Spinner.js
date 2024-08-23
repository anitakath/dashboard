
import styles from './Spinner.module.css'

const Spinner = () =>{


    return (
      <div className="relative w-full h-96 flex justify-center items-center">
        <div className={styles.spinner}></div>
        <h1 className={styles.submitting_p}> submitting...</h1>
      </div>
    );
}

export default Spinner