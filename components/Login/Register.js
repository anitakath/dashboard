import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "@/store/authReducer"; // Falls du den Status nach dem Registrieren setzen möchtest
import { useRouter } from "next/router";
import styles from "./Login.module.css"; // Erstelle eine CSS-Datei für das Styling
import { supabase } from "@/services/supabaseClient"; // Importiere Supabase

const Register = (props) => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const setSuccessMessage = props.setSuccessMessage;
  const successMessage = props.successMessage;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return regex.test(email);
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    if (!validateEmail(registerData.email)) {
      setError("The e-mail address is invalid.");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    try {
      const { user, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("This e-mail address is already registered.");
        } else {
          setError(error.message);
        }
      } else {
        console.log("User registered:", user);
        dispatch(setLogin(true));
        setSuccessMessage("Registration successful! You can now log in."); 
        setRegister(false); 
        router.push("/"); 
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error has occurred. Please try again.");
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-center w-full h-full py-2 m-0 p-0 relative border-8">
        <form
          className="w-1/2 flex flex-col items-center justify-center"
          onSubmit={registerHandler}
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
            placeholder="Passwort"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Passwort wiederholen"
            className={styles.input}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.btn}>
            Registrieren
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && (
            <p className="text-green-500">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
