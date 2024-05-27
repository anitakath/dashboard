// DetailsPage.js

import { useRouter } from "next/router";
import Navigation from "../Navigation/Navigation";
import Link from "next/link";


//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const DetailsPage = () => {
  const router = useRouter();
  const { entryId } = router.query;

  // Hier kannst du den Eintrag basierend auf der entryId aus dem Router abrufen

  return (
    <div className="w-full h-screen p-14">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative">
        <Link href="/" className=" absolute m-2 p-2 cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft}  className="goback"/>
        </Link>

        <div className="m-4 p-4 pl-14  w-full ">
          <h1 className="text-2xl border-b-2 my-2"> Details page </h1>
          <p className="py-4 px-2">
            {" "}
            show the contents of the clicked diary entry
          </p>
        </div>
        {/* Zeige die Navigation-Komponente in der DetailsPage an */}
        {/* Hier kannst du den Inhalt der DetailsPage einfügen */}
      </div>
    </div>
  );
};

export default DetailsPage;
