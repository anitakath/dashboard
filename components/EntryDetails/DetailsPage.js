// DetailsPage.js

import { useRouter } from "next/router";
import Navigation from "../Navigation/Navigation";
import Link from "next/link";


//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";


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
    (sport) => sport.entryId === lastPathPart
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

    console.log("deleting");
  };

  return (
    <div className="w-full h-screen   m-4 md:p-14">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative">
        <Link href="/" className=" absolute m-2 p-2 cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} className="font_purple" />
        </Link>

        <button className={styles.delete_btn} onClick={deleteEntryHandler}>
          <FontAwesomeIcon icon={faTrash} />
        </button>

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
  );
};

export default DetailsPage;
