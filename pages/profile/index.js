import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
//FONT AWeSOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
//REDUX
import { useSelector, useDispatch } from "react-redux";
import { setSelectedSport } from "@/store/sportReducer";
import { setSection } from "@/store/profileReducer";
import styles from "../../styles/Profile.module.css";
//COMPONENTS
import Plans from "@/components/Profile/Plans/Plans";
import Login from "@/components/Login/Login";
import Settings from "@/components/Profile/Settings/Settings";
//CUSTOM HOOKS
import useAuth from "@/custom-hooks/auth/useAuth";

const Profile = () => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.sport.navigation)
    const selectedSport = useSelector((state) => state.sport.selectedSport)
    const [profileSection, setProfileSection] = useState("sports")
    const router = useRouter();
    const section = useSelector((state) => state.profile.section)
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)


    useEffect(()=>{
      dispatch(setSection(section))
      setProfileSection(section);

    }, [section])
    
    const { logoutHandler } = useAuth();


    const chooseSportHandler = (index) => {
      const selectedSport = navigation[index];
      dispatch(setSelectedSport(selectedSport));
      router.push("/")
    };

    const profileSectionHandler = (section) =>{
      setProfileSection(section);

    }

    // Funktion zum Hochladen eines Bildes
    const handleImageUpload = async (sport) => {

      
      /*const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";

      fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            await uploadImageToSupabase(file, sport); // Hier wird die Upload-Funktion aufgerufen
            alert("Bild erfolgreich hochgeladen!");
          } catch (error) {
            console.error("Fehler beim Hochladen des Bildes:", error);
          }
        }
      };
      fileInput.click();*/
    };


  return (
    <div className="w-full h-screen sm:p-4 md:p-14">
      {!isLoggedIn && <Login />}
      {isLoggedIn && (
        <div className="flex w-full h-full border-2 overflow-scroll my-12 md:my-0 sm:py-2 p-0 relative ">
          <Link href="/" className="z-50 absolute top-0 lg:relative h-10 w-10 m-2 p-2 cursor-pointer flex justify-center items-center ">
            <FontAwesomeIcon icon={faArrowLeft} className="font_purple" /> 
          </Link>

          <div className="  my-14  lg:m-0   sm:m-4 lg:p-4 lg:pl-14  relative w-full overflow-scroll">
            {profileSection === "plans" && (
              <h1 className={`${styles.textBackground} relative p-4`}>
                plan your future workouts
              </h1>
            )}
            {profileSection === "settings" && (
              <h1 className={`${styles.textBackground} relative left-10 p-4`}>
                your personal data
              </h1>
            )}
            {profileSection === "sports" && (
              <h1 className={`${styles.textBackground} relative left-10 p-4`}>
                sports overview
              </h1>
            )}

          <div className="text-xl flex sm:mt-4 mb-4 justify-evenly border-b pb-2">
              <button onClick={() => profileSectionHandler("sports")}>
                  <h2 className={`${profileSection === "sports" ? styles.activeSection : ""} ${styles.navigationTitle}`}>
                      Sports
                  </h2>
              </button>
              <button onClick={() => profileSectionHandler("plans")}>
                  <h2 className={`${profileSection === "plans" ? styles.activeSection : ""} ${styles.navigationTitle}`}>
                      Plans
                  </h2>
              </button>
              <button onClick={() => profileSectionHandler("settings")}>
                  <h2 className={`${profileSection === "settings" ? styles.activeSection : ""} ${styles.navigationTitle}`}>
                      Settings
                  </h2>
              </button>
          </div>

            <div className="flex w-full flex-wrap justify-center">
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
                    {/* Kamera-Symbol hinzufügen */}
                    <FontAwesomeIcon
                      icon={faCamera}
                      className={styles.camera}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageUpload(sport);
                      }}
                    />
                  </div>
                ))}

              {profileSection === "plans" && (
                <div className={styles.plan_div}>
                  <Plans />
                </div>
              )}

              {profileSection === "settings" && (
                <div className={styles.plan_div}>
                  <Settings />
                </div>
              )}
            </div>
            <div className="flex justify-center my-4">
              <button className={styles.logout_btn} onClick={logoutHandler}>
                <Image
                  src="/power-off.png"
                  alt="Power Off Icon"
                  width={50}
                  height={50}
                  fetchpriority="high"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
