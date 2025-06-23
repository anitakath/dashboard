import styles from '../Annual.module.css'
import { useSelector } from 'react-redux'
import RestDaysCalendar from './RestDaysCalendar'

const ThirdSection = ({date}) =>{

    const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)


    return(
        <div className={styles.container}>
            <h1 className="text-xl w-full flex mx-4 my-4 justify-center items-center ">
                rest days in {date.year} ...
            </h1>
            <RestDaysCalendar allSupabaseSports={allSupabaseSports} date={date} />
        </div>
    )
}

export default ThirdSection