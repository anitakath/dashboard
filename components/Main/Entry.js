import Link from "next/link";

//STYLES
import styles from './Entry.module.css'

const Entry = (props) =>{

  const filteredByDate = props.filteredByDate
  const formatDate = props.formatDate

  return (
      <div>
        {filteredByDate.map((entry, index) => (
          <div className={styles.entry} key={index}>
            <Link href={`/details/${entry.entryPath}`}>
              <div className={styles.link}>
                <p className="my-2 px-2 text-xs absolute right-4">
                  {formatDate(entry.created_at)}
                </p>
                <h2 className="text-2xl mb-4 mt-2 px-2">{entry.title}</h2>
                <p className="px-2 mb-4"> {entry.entry}</p>
              </div>
            </Link>
          </div>
        ))}
        
      </div>
  );
}

export default Entry