import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./Login.module.css"; // Erstelle eine CSS-Datei für das Styling
import { supabase } from "@/services/supabaseClient"; // Importiere Supabase
import { useCallback } from "react";
//CUSTOM HOOKS
import useAuth from "@/custom-hooks/auth/useAuth";
//COMPONENTS
import InfoBoard from "../UI/InfoBoard";

const Register = ({ setRegister, setSuccessMessage, successMessage }) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [infoBoardOpen, setInfoBoardOpen] = useState(false)
  const [infoBoardDetails, setInfoBoardDetails] = useState(null)

  const validateInputs = () => {
    const { name, email, password, confirmPassword } = registerData;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid e-mail address.";
    if (name.length < 1 || name.length > 20)
      return "The name must be between 1 and 20 characters long.";
    if (password !== confirmPassword) return "The passwords do not match.";
    if (!/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/.test(password))
      return "The password must be at least 6 characters long and contain at least one capital letter and one number.";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };


  const { registerHandler } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerHandler(registerData); // Registriere den Benutzer
      setSuccessMessage("Registrierung erfolgreich!"); // Erfolgreiche Nachricht
      setError(null); // Setze Fehler zurück
    } catch (err) {
      setError(err.message); // Setze Fehlernachricht
      //setSuccessMessage(null); // Setze Erfolgsmeldung zurück
    }
  };

  const openInfoBoard = () =>{
    setInfoBoardOpen(!infoBoardOpen)
    setInfoBoardDetails("Registration with the help of Supabase");
  }

 
  return (
    <div className="w-full h-full p-4">
      <div className=" flex flex-col items-center justify-center w-full h-full py-2 m-0 p-0 relative border-8">
        <form
          className="w-1/2 flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Repeat password"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.btn}>
            Register
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {error && (
            <div className=" flex my-4 border-2 p-4 bg-red-200 flex-col">
              <p className="text-xl">
                "Email address {registerData.email} cannot be used as it is not authorized?"
              </p>
              <button className=" pointer text-red-700 p-2 text-xl" onClick={openInfoBoard}> click here to see why </button>
            </div>
          )}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
        </form>

        <Link href="/login" className="relative top-2 text-xl">
          already registered?
          <span className={styles.register}>login here</span>
        </Link>
        {infoBoardOpen && <InfoBoard setInfoBoardOpen={setInfoBoardOpen} infoBoardOpen={infoBoardOpen} setInfoBoardDetails={setInfoBoardDetails} infoBoardDetails={infoBoardDetails}/>}
      </div>
    </div>
  );
};

export default Register;
