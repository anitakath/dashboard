
import styles from './SummarizedEntries.module.css'
import { formatDate } from '@/custom-hooks/formatDate';

const FilteredMonthEntries = (props) =>{


    const filteredCurrentMonthEntries = props. filteredCurrentMonthEntries


    return (
      <div>
        {filteredCurrentMonthEntries &&
          filteredCurrentMonthEntries.map((entry, index) => (
            <div key={index} className={styles.searchEntries_div}>
              <h3 className={styles.title_days}>{entry.title}</h3>

              <div className="flex my-2 justify-between relative">
                <p className="m-2 mt-4"> {entry.entry}</p>
                <p className={styles.created_at}>
                  {formatDate(entry.created_at)}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
}

export default FilteredMonthEntries