// DetailsPage.js

import { useRouter } from "next/router";
import Navigation from "../Navigation/Navigation";
import Link from "next/link";
import Image from "next/image";

//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";


//REDUX
import { useSelector } from "react-redux";

//STYLES
import styles from './Details.module.css'

import { supabase } from "@/services/supabaseClient";


const DetailsPage = () => {
  const router = useRouter();
  const { entryId } = router.query;

  // Extract the last part of the path to “/details/”
  const pathParts = router.asPath.split("/");
  const lastPathPart = pathParts[pathParts.length - 1];
  const allSports = useSelector((state) => state.sport.allSupabaseSports);

  //filter out the object from allSports whose entryId is identical to the last part of the URL
  
  const filteredEntry = allSports.filter(
    (sport) => sport.entryPath === lastPathPart
  );


  const deleteEntryHandler = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("sports")
      .delete()
      .eq("title", filteredEntry[0].title)
      .eq("id", filteredEntry[0].id);

    if (error) {
      console.error("Fehler beim Löschen des Eintrags:", error.message);
    } else {
      console.log("Eintrag erfolgreich gelöscht");
      router.push("/");
    }

  };

  const editEntryHandler = (e) =>{
    e.preventDefault();
  }

  return (
    <div className="w-full h-screen  m-0 md:p-14">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative z-20">
        <div className=" absolute w-full h-full m-0  z-0 top-0">  {/* future image div*/} </div>
        <div className="absolute w-full h-full z-10 top-0">
          <Link href="/" className=" absolute m-2 p-2 cursor-pointer">
            <FontAwesomeIcon icon={faArrowLeft} className="font_purple" />
          </Link>
        
        <div className={styles.buttons_div}>
           <button className={styles.delete_btn} onClick={deleteEntryHandler}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button  className={styles.edit_btn} onClick={editEntryHandler}> <FontAwesomeIcon icon={faPencil} /></button>
        </div>
       

        <div className="m-4 p-4 pl-14  w-full ">
          <h1 className="text-2xl border-b-2 my-2"> Details page </h1>
          {filteredEntry.length > 0 && (
            <div className="my-4 py-2">
              <h2 className={styles.title}> {filteredEntry[0].title}</h2>
              <p className={styles.entry}>{filteredEntry[0].entry}</p>
            </div>
          )}
        </div>
        </div>
       
      </div>
    </div>
  );
};

export default DetailsPage;
