import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faUser, faHouse, faUsers } from "@fortawesome/free-solid-svg-icons";
//COMPONENTS
import UserImage from "@/components/UI/UserImage";
import SearchBar from "@/components/UI/SearchBar";
import ResultsBar from "@/components/UI/ResultsBar";
import Menu from "./Menu";
//STYLES 
import styles from './BoardHeader.module.css'
//CUSTOM HOOKS
import useAuth from "@/custom-hooks/auth/useAuth";
import { useSearchTerm } from "@/custom-hooks/useSearchTerm";
//REDUX 
import { useSelector} from "react-redux";


const BoardHeader = ({openMenu, setOpenMenu}) =>{
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSearchedEntries = useSearchTerm(allSupabaseSports, searchTerm)
  const { logoutHandler } = useAuth();

  return (
    <div className={styles.headerDiv} id="headerDiv">
      {openMenu && <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} />}

      <div className={styles.searchBarResult_div}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {searchTerm != "" && (
            <div className={styles.results_div}>
              <ResultsBar filteredSearchedEntries={filteredSearchedEntries} />
              <button
                className={styles.close_resultsBar_div}
                onClick={() => setSearchTerm("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}
        </div>

       
        <div className="h-14 hidden md:flex items-center w-full justify-center lg:justify-end ">
          <p className={styles.icons}>
            <Link href="/" className={styles.backToHomepage_link}>
              <FontAwesomeIcon icon={faHouse} className="font_purple" />
            </Link>
          </p>
          <p className={styles.icons}>
            <FontAwesomeIcon
              icon={faBars}
              className="font_purple"
              onClick={() => setOpenMenu(true)}
            />
          </p>
        <Link href="/profile" className={styles.icons}>
          <FontAwesomeIcon icon={faUser} className="font_purple" />
        </Link>
        <Link href="/community" className={styles.icons}>
          <FontAwesomeIcon icon={faUsers} className="font_purple" />
        </Link>

        
        <button className={styles.icons} onClick={logoutHandler}>
          <Image
            src="/power-off.png"
            alt="Power Off Icon"
            width={30}
            height={30}
            className={styles.logout_btn}
            fetchPriority="high" 
          />
        </button>


      </div>
    </div>
  );
}

export default BoardHeader