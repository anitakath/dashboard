import { useEffect, useState } from "react";

import Link from "next/link";

//STYLES
import styles from './Board.module.css'


//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";


//FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faUser, faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddEntryForm from "./AddEntryForm";
import { current } from "@reduxjs/toolkit";

const Board = (props) => {
 
  const currentSport = props.currentSport;


  const filteredEntries = props.filteredEntries;
  const [formIsOpen, setFormIsOpen] = useState(false);




  const addEntryHandler = (e) => {
    e.preventDefault();
    setFormIsOpen((prevFormIsOpen) => !prevFormIsOpen);
  };

  let addEntryText = formIsOpen ? "close form" : "add entry";

  return (
    <div className="w-full overflow-scroll h-full p-4">
      <div className="h-20 flex p-4 flex items-center relative">
        <input
          type="text"
          placeholder="search..."
          className="border-b-2 w-3/12 mx-4 p-2 text-xl"
        ></input>
        <p className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faHouse} className="font_purple" />
        </p>
        <p className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faBars} className="font_purple" />
        </p>
        <p className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faUser} className="font_purple" />
        </p>

        <p
          className="absolute right-14 top-2 h-20 w-20 p-4"
          style={{ backgroundColor: "var(--purpleDarkHover)" }}
        ></p>
      </div>

      <div className="flex  justify-center ">
        <div className="p-4 relative mt-4 mr-1 mb-4 w-2/3 ">
          <h1 className="text-2xl border-b-2 my-2"> {currentSport} </h1>

          <div className="flex items-center">
            <button className={"text-xl my-2 mx-1"}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={styles.chevron}
              />
            </button>
            <button className=" text-xl my-2">
              <FontAwesomeIcon
                icon={faChevronRight}
                className={styles.chevron}
              />
            </button>
            <p className="mx-10 text-xs">
              click on the diary entries to get more details
            </p>
          </div>

          <div>
            <button className={styles.add_entry_btn} onClick={addEntryHandler}>
              {addEntryText}
            </button>

            <TransitionGroup>
              {formIsOpen && (
                <CSSTransition
                  classNames={{
                    enter: "slide-enter",
                    enterActive: "slide-enter-active",
                    exit: "slide-exit",
                    exitActive: "slide-exit-active",
                  }}
                  timeout={300}
                >
                  <AddEntryForm />
                </CSSTransition>
              )}
            </TransitionGroup>
          </div>

          {filteredEntries &&
            filteredEntries.map((entry, index) => (
              <div className={styles.entry}>
                <Link href={`/details/${entry.title}`}>
                  <div className={styles.link}>
                    <p className="my-2 ">{entry.created_at}</p>
                    <h2 className="text-2xl my-2 px-2">{entry.title}</h2>
                    <p className="px-4"> {entry.entry}</p>
                  </div>
                </Link>
              </div>
            ))}
        </div>

        <div className="p-4 mt-4 ml-1 mb-4 w-1/3 relative  ">
          <h1 className="text-2xl  border-b-2 my-2"> Summary </h1>

          <div className="absolute right-6 top-4 p-2 flex items-center">
            <p className="text-xs">choose year</p>
            <select name="year" id="year" className={styles.year_input}>
              <option value="2023"> 2023</option>
              <option value="2024"> 2024</option>
              <option value="2025"> 2025</option>
              <option value="2026"> 2026</option>
            </select>
          </div>

          <div className="flex items-center">
            <button className={"text-xl my-2 mx-1"}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className={styles.chevron}
              />
            </button>
            <button className=" text-xl my-2">
              <FontAwesomeIcon
                icon={faChevronRight}
                className={styles.chevron}
              />
            </button>
            <p className="ml-10"> chosen year...</p>
          </div>
          <div className="my-4 p-0 grid grid-cols-3 gap-1">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((month) => (
              <div key={month} className={styles.month}>
                {month}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;