import { useEffect, useState } from "react";

import Link from "next/link";

//STYLES
import styles from './Board.module.css'

const Board = (props) => {
  const currentSport = props.currentSport;
  const allSports = props.allSports;
  const selectedSport = allSports[currentSport].name;

  console.log(allSports)
  console.log(selectedSport);

  const [entries, setEntries] = useState(null)

  useEffect(()=>{
    if(allSports){
      setEntries(allSports[currentSport].entries)
    }
  }, [selectedSport])

  console.log(entries)

  return (
    <div className="w-full overflow-scroll h-full p-4">
      <div className="h-20 flex p-4 flex items-center relative">
        <input type="text" placeholder="search..."></input>
        <p className="mx-4"> icon </p>
        <p className="mx-4"> icon </p>
        <p className="mx-4"> icon </p>
        <p className="absolute right-4"> image </p>
      </div>

      <div className="flex justify-center ">
        <div className="p-4 mt-4 mr-1 mb-4 w-2/3 ">
          <h1 className="text-2xl border-b-2 my-2"> {selectedSport} </h1>

          <p className="my-4 text-xs">
            click on the diary entries to get more details
          </p>
          {entries &&
            entries.map((entry, index) => (
              <div className={styles.entry}>
                <Link href={`/details/${index}`} >
                  <div className={styles.link}>
                    <p>{entry.date}</p>
                    <p> {entry.entry}</p>
                  </div>
                </Link>
              </div>
            ))}
        </div>

        <div className="p-4  mt-4 ml-1 mb-4 w-1/3">
          <h1 className="text-xl border-b-2 my-2"> Summary </h1>
        </div>
      </div>
    </div>
  );
};

export default Board;