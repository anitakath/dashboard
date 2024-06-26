import { useState } from "react";

import Link from "next/link";

//STYLES
import styles from './Board.module.css'


//TRANSITION GROUP
import { TransitionGroup, CSSTransition } from "react-transition-group";


//FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddEntryForm from "./AddEntryForm";


//REDUX
import { useSelector } from "react-redux";



//COMPONENTS
import Calendar from "./Calendar";
import Entry from "./Entry";
import Navigation from "../Navigation/Navigation";

const Board = (props) => {
  const currentSport = props.currentSport;
  const filteredEntries = props.filteredEntries;

  const [formIsOpen, setFormIsOpen] = useState(false);

  const actualDate = useSelector((state) => state.calendar);



  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const actualMonthIndex = monthNames.findIndex(month => month === actualDate.month);
  const actualMonth = actualMonthIndex + 1;

  const filteredByDate = filteredEntries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    const entryYear = entryDate.getFullYear();
    const entryMonth = entryDate.getMonth() + 1; // Monat von 0-11 zu 1-12 ändern

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

      {/*---------------------- MOBILE NAVIGATION ---------------------- */}
      <div className="flex lg:hidden">
        <Navigation />
      </div>

      <div className="flex justify-center lg:flex-row flex-col ">
        <div className="p-4 relative  mt-4 mr-1 mb-4 w-2/3 sm:w-full max-h-1/2 overflow-y-scroll">
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
                    <AddEntryForm setFormIsOpen={setFormIsOpen} />
                  </CSSTransition>
                )}
              </TransitionGroup>
            </div>
          )}

          {/* --------------------------  THE ENTRIES -------------------------- */}

          {filteredByDate.length === 0 && (
            <p className="m-2 text-xl"> no entries were made </p>
          )}
          {filteredByDate && (
            <Entry filteredByDate={filteredByDate} formatDate={formatDate} />
          )}
        </div>

        {/*  -------------------------- SUMMARY SECTION  -------------------------- */}

        <Calendar filteredByDate={filteredByDate} />
      </div>
    </div>
  );
};

export default Board;