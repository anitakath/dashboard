import React, { useState } from "react";
import styles from "./Menu.module.css";
import Link from "next/link";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSection } from "@/store/profileReducer";


const Menu = () => {
  const [openSections, setOpenSections] = useState({
    yourSports: false,
    yourProfile: false,
    community: false,
  });
  const dispatch = useDispatch();

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };


  const navigateHandler = () =>{

  }


  return (
    <div className={styles.menu_div_backdrop}>
      <div className={styles.menu_div}>
        <h1 className={styles.title}>MENU</h1>
        <ul className={styles.table}>
          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("yourSports")}
            >
              Your Sports
            </button>
          </li>
          {openSections.yourSports && (
            <>
              <li className={styles.link}>Statistics</li>
              <li className={styles.link}>All Sports</li>
              <li className={styles.link}>Planned Sports Units</li>
              <li className={styles.link}>Completed Sports Units</li>
            </>
          )}
          <br />
          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("yourProfile")}
            >
              Your Profile
            </button>
          </li>
          {openSections.yourProfile && (
            <>
              <li className={styles.link} onClick={navigateHandler}>
                <Link href="/profile" onClick={ () => dispatch(setSection("settings"))}> Settings</Link>
              </li>
            </>
          )}
          <br />
          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("community")}
            >
              Community
            </button>
          </li>
          {openSections.community && (
            <>
              <li className={styles.link}>Your Friends</li>
              <li className={styles.link}>Find Friends</li>
            </>
          )}
          <br />
          <div className={styles.anne_div}>
            <li className={styles.anne_link}>About Anne</li>
            <li className={styles.anne_link}>Contact Anne</li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
