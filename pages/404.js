

import Link from "next/link";
import styles from "./404.module.css"; // Optional: Importiere CSS-Modul für Styling

const Custom404 = () => {
  return (
    <div className={styles.container}>
      <h1>404 - Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/" className={styles.link}>Back to the homepage</Link>
    </div>
  );
};

export default Custom404;
