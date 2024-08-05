import Link from 'next/link';

//STYLES
import styles from './ResultsBar.module.css'

const ResultsBar = ({ filteredSearchedEntries }) => {
  // Check whether there are filtered entries
  if (!filteredSearchedEntries || filteredSearchedEntries.length === 0) {
    return (
      <div className="my-1 mx-1">
        <h1>Keine Ergebnisse gefunden</h1>
      </div>
    );
  }

  return (
    <div>
      {filteredSearchedEntries.map((entry) => (
        <div key={entry.id} className={styles.result_entry}>
          <Link href={`/details/${entry.entryPath}`}>
            <h3>
              <strong> {entry.title}</strong>
            </h3>
            <p>{entry.entry}</p>

            <p>{new Date(entry.created_at).toLocaleString()}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ResultsBar;
