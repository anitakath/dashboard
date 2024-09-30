import React, { useState } from "react";
import styles from "./Menu.module.css";
import Link from "next/link";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSection } from "@/store/profileReducer";
import { useRouter } from "next/router";

const Menu = ({ setOpenMenu }) => {
  
  const [openSections, setOpenSections] = useState({
    yourSports: true,
    yourProfile: true,
    community: true,
    app: true,
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  console.log(openSections);

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
          X 
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
          {openSections.yourSports && (
            <>
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
                {" "}
                Statistics{" "}
              </Link>
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
                <Link
                  href="/profile"
                  onClick={() => navigateHandler("settings")}
                >
                  Settings
                </Link>
              </li>
              <li className={styles.link}> Favorites </li>
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
              <li className={styles.link}>Events</li>
              <li className={styles.link}>Your Friends</li>
              <li className={styles.link}>Find Friends</li>
            </>
          )}
          <br />

          <li>
            <button
              className={styles.table_title}
              onClick={() => toggleSection("app")}
            >
              About this Diary
            </button>
          </li>
          {openSections.app && (
            <>
              <li className={styles.link}> How to use this app </li>
              <li className={styles.link}> Help / Support </li>
              <li className={styles.link}> Feedback </li>
              <li className={styles.link}> Notifications </li>
              <li className={styles.link}> Privacy Policy </li>
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

/*    <button
          onClick={() => dispatch(setSelectedSport("start"))}
          className="absolute text-xl left-2 top-1 hover:text-red-500"
        >
          ?
        </button>*/
