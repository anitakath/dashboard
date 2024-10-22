import { useRouter } from "next/router";
import Link from "next/link";
//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
//REDUX
import { useSelector } from "react-redux";
//STYLES
import styles from './Details.module.css'
//CUSTOM HOOKS
import { useDeleteCompletedSport } from "@/custom-hooks/useSportEntries";


const DetailsPage = () => {
  const router = useRouter();
  const userId = useSelector((state) => state.auth.userId)
  // Extract the last part of the path to “/details/”
  const pathParts = router.asPath.split("/");
  const lastPathPart = pathParts[pathParts.length - 1];
  const allSports = useSelector((state) => state.sport.allSupabaseSports);
  //filter out the object from allSports whose entryId is identical to the last part of the URL
  const filteredEntry = allSports.filter((sport) => sport.entryPath === lastPathPart);
  const { deleteSport, loading, error } = useDeleteCompletedSport(userId);
  

  const deleteEntryHandler = async (e) => {
    e.preventDefault();

    if (filteredEntry.length > 0) {
      const result = await deleteSport(
        filteredEntry[0].title,
        filteredEntry[0].id
      );

      if (result.success) {
        router.push("/");
      }
    }
  };


  const editEntryHandler = (e) =>{
    e.preventDefault();
  }

  return (
    <div className="w-full h-screen m-0 md:p-14">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative z-20">
        <div className=" absolute w-full h-full m-0  z-0 top-0">
          {/* future image div*/}
        </div>
        <div className="absolute w-full h-full z-10 top-0">
          <Link href="/" className=" absolute mt-2 p-2 cursor-pointer">
            <FontAwesomeIcon icon={faArrowLeft} className={styles.goback_link}/>
          </Link>

          <div className={styles.buttons_div}>
            <button className={styles.delete_btn} onClick={deleteEntryHandler}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button className={styles.edit_btn} onClick={editEntryHandler}>
              {" "}
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </div>

          <div className=" mt-4 w-full ">
         
            {filteredEntry.length > 0 && (
              <div className="mt-10 py-2">
                <h2 className={styles.title}> {filteredEntry[0].title}</h2>
                <p className={styles.entry}>{filteredEntry[0].entry}</p>
              </div>
            )}

            {loading && (
              <p className="text-2xl flex justify-center text-red-500">
                deleting ...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
