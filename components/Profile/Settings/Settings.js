import { useState } from 'react';
import Link from 'next/link';
import styles from './Settings.module.css'
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse} from "@fortawesome/free-solid-svg-icons";
//REDUX
import { useSelector } from 'react-redux';

const Settings = () =>{
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user.user.user_metadata.name);
  const [email, setEmail] = useState(user.user.user_metadata.email);
  const [password, setPassword] = useState("**********");
  const [message, setMessage] = useState("moin");
      

  console.log(user.user.user_metadata.email);

      const handleSubmit = (e) => {
        e.preventDefault();
        // Hier können Sie die Logik zum Speichern der Daten hinzufügen
        setMessage("Ihre Daten wurden erfolgreich gespeichert!");
      };


    return (
      <div className="flex justify-center items-center w-full ">
        <div className={styles.container}>
          <div className="flex justify-center h-16 items-center relative w-full">
            <h1 className={styles.title}> edit your personal data </h1>
            <Link href="/" className={styles.home_link}>
              <FontAwesomeIcon icon={faHouse} />
            </Link>
          </div>
          <div className={styles.settingsField}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  E-Mail:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>{" "}
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                />
              </div>
              <button type="submit" className="primary_button">
                Speichern
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}

export default Settings;