
import styles from './Spinner.module.css'

const Spinner = ({text}) =>{


    return (
      <div className="relative w-full h-full flex justify-center items-center">
        <div className={styles.spinner}></div>
        <h1 className={styles.submitting_p}> {text} </h1>
      </div>
    );
}

export default Spinner