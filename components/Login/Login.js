import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "@/store/authReducer";
import { useRouter } from "next/router";
import styles from './Login.module.css'
import { supabase } from "@/services/supabaseClient";
import { StyleRegistry } from "styled-jsx";

const Login = (props) =>{

  const setRegister = props.setRegister;
  const successMessage = props.successMessage;

  const [loginData, setLoginData] = useState({
    email: null,
    password: null,
  })
  const [error, setError] = useState(null);

  const router = useRouter()

  const dispatch = useDispatch();




  const handleChange = (e) => {
    const { name, value } = e.target;
   setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const loginHandler = async (e) => {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars
    /*const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: loginData.name, // Hier wird der Benutzername als E-Mail verwendet
      password: loginData.password,
    });
    if (error) {
      setError(error.message);
    } else {
      // Redirect or update state to show logged-in content
      console.log("User logged in:", user);
    }
 */
    dispatch(setLogin(true));
    router.push("/")



    /*
    const user = process.env.LOGIN_USERNAME;
    const pass = process.env.LOGIN_PASSWORD;
    // Überprüfen der Anmeldedaten
    if (loginData.name === user && loginData.password === pass) {
      try {
        // Senden der Daten an die API
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });

        if (response.ok) {
          // Erfolgreiche Anmeldung
          dispatch(setLogin(true));
          router.push("/dashboard"); // Weiterleitung nach erfolgreichem Login
        } else {
          // Fehlerbehandlung hier
          console.error("Login failed");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      console.error("Invalid credentials");
    }
    */
  };




    return (
      <div className="w-full h-full p-4 ">
        <div className="flex justify-center w-full h-full py-2 m-0 p-0 relative border-8">
          <form
            className=" w-1/2 flex flex-col items-center justify-center"
            onSubmit={loginHandler}
          >
            <input
              type="email"
              name="email"
              placeholder="email"
              className={styles.input}
              onChange={handleChange}
            ></input>
            <input
              type="password"
              name="password"
              placeholder="password"
              className={styles.input}
              onChange={handleChange}
            ></input>
            <button type="submit" className={styles.btn}>
              LOGIN
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <p> not registered yet? </p>
            <button
              type="button"
              className={styles.register_btn}
              onClick={() => setRegister(true)}
            >
              register here
            </button>
            {successMessage && <p> {successMessage}</p>}
          </form>
        </div>
      </div>
    );
}

export default Login;