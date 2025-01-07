//STYLES
import styles from './SummarizedEntries.module.css'
import colors from '../../../styles/Colors.module.css'

//CUSTOM HOOKS
import { formatDate } from '@/custom-hooks/times_and_dates/useFormatDate';

const FilteredMonthEntries = (props) =>{


  const filteredCurrentMonthEntries = props. filteredCurrentMonthEntries


    return (
      <div>
        {filteredCurrentMonthEntries &&
          filteredCurrentMonthEntries.map((entry, index) => (
            <div key={index} className={colors[entry.label]}>
              <h3 className={styles.search_title_days}>{entry.title}</h3>
      

              <div className="flex my-2 justify-between relative">
                <p className="m-2 mb-3"> {entry.entry}</p>
                <p className={styles.search_created_at}>
                  {formatDate(entry.created_at)}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
}

export default FilteredMonthEntries