import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Settings.module.css'
//FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse} from "@fortawesome/free-solid-svg-icons";
//REDUX
import { useSelector, useDispatch} from 'react-redux';
import { setUser } from '@/store/authReducer';
import { supabase } from '@/services/supabaseClient';

const Settings = () =>{
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user.user.user_metadata.name);
  const [email, setEmail] = useState(user.user.user_metadata.email);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
      

  useEffect(() => {
    if (user && user.user) {
      setName(user.user.user_metadata.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //did user change their password?
    /*if (password != "") {
      const confirmChange = window.confirm(
        "Do you really want to change your password?"
      );
      if (!confirmChange) return; 
    }*/


    try {
      // Updating user data in Supabase
      const updates = {};

      if (name !== user.user.user_metadata.name) {
        updates["user_metadata"] = { ...user.user.user_metadata, name };
      }

      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
        data: { name },
        // its possible to change users password here too :-)
      });

      dispatch(
        setUser({
          ...user,
          user: {
            ...user.user,
            user_metadata: {
              ...user.user.user_metadata,
              name,
            },
          },
        })
      );

      if (updateError) throw updateError;
      setMessage("your name was changed successfully");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
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
              <span className={styles.display_input}>{email}</span>
            </div>{" "}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password:
              </label>
              <span className={styles.display_input}>*********</span>
            </div>
            <button type="submit" className="primary_button">
              Save
            </button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;