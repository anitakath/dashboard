import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from './Login.module.css'
//CUSTOM HOOKS
import useAuth from "@/custom-hooks/auth/useAuth";

const Login = (props) =>{
  const successMessage = props.successMessage;

  const [loginData, setLoginData] = useState({
    email: null,
    password: null,
  })
  const [error, setError] = useState(null);
  const router = useRouter()

  const { loginHandler } = useAuth();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         await loginHandler(loginData);
         // Warten bis der Zustand aktualisiert ist
         router.push("/");
       } catch (err) {
         setError(err.message);
       }
     };

 


  return (
      <div className="w-full h-full  p-4">
        <div className="flex justify-center w-full h-full py-2 m-0 p-0 relative border-8">
          <form
            className="sm:w-full lg:w-1/2 flex flex-col items-center justify-center"
            onSubmit={handleSubmit}
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
            <Link href="/register" className="relative top-2 text-xl">
              not registered yet? register here
            </Link>
            {successMessage && <p> {successMessage}</p>}
          </form>
        </div>
      </div>
    );
}

export default Login;