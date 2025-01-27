


import React, { useState } from "react";
import styles from "./Menu.module.css";
import Link from "next/link";
//REDUX
import { useDispatch } from "react-redux";
import { setSection } from "@/store/profileReducer";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import UserImage from "@/components/UI/UserImage";


const Menu = ({ setOpenMenu }) => {
  const [openSections, setOpenSections] = useState({
    yourSports: true,
    yourProfile: false,
    community: false,
    app: false,
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigateHandler = (e) => {
    const sectionMap = {
      allsports: "sports",
      plans: "plans",
      settings: "settings",
    };

    if (sectionMap[e]) {
      dispatch(setSection(sectionMap[e]));
      router.push("/profile");
      setOpenMenu(false);
    }
  };

  return (
    <div
      className={styles.menu_div_backdrop}
      onClick={() => setOpenMenu(false)}
    >
      <div className={styles.menu_div} onClick={(e) => e.stopPropagation()}>

        <button className={styles.close_btn} onClick={() => setOpenMenu(false)}>
         <FontAwesomeIcon icon={faXmark} />
        </button>
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
            <div className={`${styles.subLinkDiv} ${openSections.yourSports ? styles.yourSportsactive : styles.subLinkInactive}`}>
              <li
                className={styles.link}
                onClick={() => navigateHandler("allsports")}
              >
                All Sports
              </li>
              <li
                className={styles.link}
                onClick={() => navigateHandler("plans")}
              >
                Planned Sports Units
              </li>
              <li className={styles.link}>Completed Sports Units</li>
              <Link className={styles.link} href="/statistics">
                Statistics
              </Link>
            </div>
          
          <br />
          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("yourProfile")}
            >
              Your Profile
            </button>
          </li>
        
          <div className={`${styles.subLinkDiv} ${openSections.yourProfile ? styles.yourProfileactive : styles.subLinkInactive}`}>
              <li className={styles.link} onClick={navigateHandler}>
                <Link
                  href="/profile"
                  onClick={() => navigateHandler("settings")}
                >
                  Settings
                </Link>
              </li>
              <li className={styles.link}> Favorites </li>
            </div>
      
          <br />
          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("community")}
            >
              Community
            </button>
          </li>
            <div className={`${styles.subLinkDiv} ${openSections.community ? styles.communityactive : styles.subLinkInactive}`}>
              <li className={styles.link}>Events</li>
              <li className={styles.link}>Your Friends</li>
              <li className={styles.link}>Find Friends</li>
            </div>
          <br />

          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("app")}
            >
              About this Diary
            </button>
          </li>
         
             <div className={`${styles.subLinkDiv} ${openSections.app ? styles.appactive : styles.subLinkInactive}`}>
              <li className={styles.link}> How to use this app </li>
              <li className={styles.link}> Help / Support </li>
              <li className={styles.link}> Feedback </li>
              <li className={styles.link}> Notifications </li>
              <li className={styles.link}> Privacy Policy </li>
            </div>
          <br />

          <div className={styles.subDiv}>
            <li className={styles.subLink}>About</li>
            <li className={styles.subLink}>Contact</li>
          </div>
        </ul>
        {/*
          <div className=" w-full flex justify-center md:hidden relative">
          <UserImage/>
          </div> 
        */}
      </div>
    </div>
  );
};

export default Menu;
