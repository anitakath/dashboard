import styles from './PlannedSportsCompact.module.css'

const PlannedSportsCompact = ({ groupedEntries }) => {
  return (
    <div className={styles.wrapper}>
    {[...groupedEntries].reverse().map((group, index) => (
        <div key={index} className={styles.group}>
          <h4 className={styles.dateTitle}>{group.dateTitle}</h4>
          <ul className={styles.entryList}>
            {group.entries.map((entry) => (
              <li key={entry.id} className={styles.entryItem}>
                <strong>{entry.title}</strong> – {entry.name} ({entry.duration} min)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default PlannedSportsCompact
