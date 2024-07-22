import { useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/router";
import Link from "next/link";

//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";

//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
import { setLogout } from "@/store/authReducer";
import { setSection } from "@/store/profileReducer";
import styles from "../../styles/Profile.module.css";

//COMPONENTS
import Plans from "@/components/Profile/Plans";

const Profile = () => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.sport.navigation)
    const selectedSport = useSelector((state) => state.sport.selectedSport)
    const [profileSection, setProfileSection] = useState("sports")
    const [active, setActive] = useState(false)
    const router = useRouter();
    const section = useSelector((state) => state.profile.section)
  


    useEffect(()=>{
      dispatch(setSection(section))
      setProfileSection(section);

    }, [section])
    


    const chooseSportHandler = (index) => {
      const selectedSport = navigation[index];
      dispatch(setSelectedSport(selectedSport));
      router.push("/")
    };

    const profileSectionHandler = (section) =>{
      if(section === "sports"){
        setProfileSection(section)
      } else if(section === "plans"){
        setProfileSection(section);
      } else if(section === "settings"){
        setProfileSection("settings")
      }

    }

    const logoutHandler = () =>{
      dispatch(setLogout(false))
    }

  return (
    <div className="w-full h-screen p-4 md:p-14">
      <div className="flex w-full h-full border-2 overflow-scroll py-2 m-0 p-0 relative">
        <Link href="/" className=" absolute m-2 p-2 cursor-pointer">
          <FontAwesomeIcon icon={faArrowLeft} className="font_purple" />
        </Link>

        <div className="m-4 p-4 pl-14  w-full">
          <h1 className="text-2xl my-8"> your profile... </h1>

          <div className=" text-xl flex mt-4 mb-4 justify-evenly">
            <button onClick={() => profileSectionHandler("sports")}>
              <h2> Sports</h2>
            </button>
            <button onClick={() => profileSectionHandler("plans")}>
              <h2> Plans </h2>
            </button>
            <button onClick={() => profileSectionHandler("settings")}>
              <h2>Settings</h2>
            </button>
          </div>

          <div className="flex w-full  flex flex-wrap justify-center">
            {profileSection === "sports" &&
              navigation &&
              navigation.map((sport, index) => (
                <div
                  key={index}
                  className={`${styles.sport_div} ${
                    selectedSport === sport ? styles.active : ""
                  }`}
                  onClick={() => chooseSportHandler(index)}
                >
                  <p className={styles.p}>{sport}</p>
                </div>
              ))}

            {profileSection === "plans" && (
              <div className={styles.plan_div}>
                <Plans/>
              </div>
            )}

            {profileSection === "settings" && (
              <div className={styles.sport_div}>
                <p> settings </p>
              </div>
            )}
          </div>
          <div className="flex justify-center my-4">
            <button className="pointer" onClick={logoutHandler}>
              <Image
                src="/power-off.png"
                alt="Power Off Icon"
                width={50}
                height={50}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
