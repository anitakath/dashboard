import { useState } from "react";



import { useRouter } from "next/router";
import Link from "next/link";

//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";


import styles from './Profile.module.css'

const Profile = () => {

    const dispatch = useDispatch();

    const navigation = useSelector((state) => state.sport.navigation)


    const selectedSport = useSelector((state) => state.sport.selectedSport)

    console.log(selectedSport)

    const router = useRouter();
    


    const chooseSportHandler = (index) => {
      const selectedSport = navigation[index];
      console.log("changing");
      console.log(selectedSport);
      dispatch(setSelectedSport(selectedSport));
      router.push("/")
    };

 
    
  return (
    <div className="w-full h-screen p-4 md:p-14">
      <div className="flex w-full h-full border-2 py-2 m-0 p-0 relative">
        <Link href="/" className=" absolute m-2 p-2 cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} className="font_purple" />
        </Link>

        <div className="m-4 p-4 pl-14  w-full">
          <h1 className="text-2xl my-6"> your sports... </h1>

          <div className="flex w-full  flex flex-wrap justify-center ">
            {navigation &&
              navigation.map((sport, index) => (
                <div
                  key={index}
                  className={styles.sport_div}
                  onClick={() => chooseSportHandler(index)}
                >
                  <p className={styles.p}>{sport}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
