import { useEffect, useState } from "react";

import Link from "next/link";

//STYLES
import styles from './Board.module.css'

//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHouse, faUser, faBars, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AddEntryForm from "./AddEntryForm";

const Board = (props) => {
  const currentSport = props.currentSport;
  const allSports = props.allSports;
  const selectedSport = allSports[currentSport].name;

  console.log(allSports)
  console.log(selectedSport);

  const [entries, setEntries] = useState(null)
  const [formIsOpen, setFormIsOpen] = useState(false)

  useEffect(()=>{
    if(allSports){
      setEntries(allSports[currentSport].entries)
    }
  }, [selectedSport])

  console.log(entries)

  const addEntryHandler = (e) =>{
    e.preventDefault()
    setFormIsOpen((prevFormIsOpen) => !prevFormIsOpen);
  }

  return (
    <div className="w-full overflow-scroll h-full p-4">
      <div className="h-20 flex p-4 flex items-center relative">
        <input type="text" placeholder="search..."></input>
        <p className="mx-4">
          <FontAwesomeIcon icon={faHouse} className="font_purple" />
        </p>
        <p className="mx-4">
          <FontAwesomeIcon icon={faBars} className="font_purple" />
        </p>
        <p className="mx-4">
          <FontAwesomeIcon icon={faUser} className="font_purple" />
        </p>

        <p className="absolute right-14 top-8 h-20 w-20 bg-rose-400 border-2 p-4"></p>
      </div>

      <div className="flex justify-center ">
        <div className="p-4 mt-4 mr-1 mb-4 w-2/3 ">
          <h1 className="text-2xl border-b-2 my-2"> {selectedSport} </h1>

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
              add an entry
            </button>
            {formIsOpen &&  <AddEntryForm/>}
            
          </div>

          {entries &&
            entries.map((entry, index) => (
              <div className={styles.entry}>
                <Link href={`/details/${index}`}>
                  <div className={styles.link}>
                    <p>{entry.date}</p>
                    <p> {entry.entry}</p>
                  </div>
                </Link>
              </div>
            ))}
        </div>

        <div className="p-4  mt-8 ml-1 mb-4 w-1/3 relative">
          <div className="absolute right-6 top-4 p-2 flex items-center">
            <p className="text-xs">choose year</p>
            <select name="year" id="year" className={styles.year_input}>
              <option value="2023"> 2023</option>
              <option value="2024"> 2024</option>
              <option value="2025"> 2025</option>
              <option value="2026"> 2026</option>
            </select>
          </div>
          <h1 className="text-xl border-b-2 my-2"> Summary </h1>
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