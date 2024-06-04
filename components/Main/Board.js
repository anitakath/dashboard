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


//REDUX
import { useSelector } from "react-redux";


//COMPONENTS
import Calendar from "./Calendar";

const Board = (props) => {
  const currentSport = props.currentSport;
  const filteredEntries = props.filteredEntries;
  const [formIsOpen, setFormIsOpen] = useState(false);

  const actualDate = useSelector((state) => state.calendar);


  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const actualMonthIndex = monthNames.findIndex(month => month === actualDate.month);
  const actualMonth = actualMonthIndex + 1


  
  const filteredByDate = filteredEntries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1; 

    return entryYear === actualDate.year && entryMonth === actualMonth;
  });



  const addEntryHandler = (e) => {
    e.preventDefault();
    setFormIsOpen((prevFormIsOpen) => !prevFormIsOpen);
  };

  let addEntryText = formIsOpen ? "close form" : "add entry";

  function formatDate(dateString) {
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);

    return date.toLocaleDateString("de-DE", options).replace(",", "");
  }

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
        <Link href="/profile" className="mx-8 cursor-pointer">
          <FontAwesomeIcon icon={faUser} className="font_purple" />
        </Link>

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

          {currentSport === null && (
            <p className=" my-10 text-2xl text-center">
              select your sport from the navigation bar
            </p>
          )}

          {currentSport != null && (
            <div>
              <button
                className={styles.add_entry_btn}
                onClick={addEntryHandler}
              >
                <span className={styles.add_btn_icon}> + </span> {addEntryText}
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
          )}

          {/* --------------------------  THE ENTRIES -------------------------- */}

          {filteredByDate.length === 0 && <p className="m-2  text-xl"> no entries were made </p>}
          {filteredByDate &&
            filteredByDate.map((entry, index) => (
              <div className={styles.entry}>
                <Link href={`/details/${entry.title}`}>
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

        {/*  -------------------------- SUMMARY SECTION  -------------------------- */}

        <Calendar />
      </div>
    </div>
  );
};

export default Board;