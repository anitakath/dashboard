import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from './Login.module.css'
//CUSTOM HOOKS
import useAuth from "../../custom-hooks/auth/useAuth";


const Login = ({ successMessage }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({
    email: false,
    password: false,
  });

  const router = useRouter();
  const { loginHandler } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginHandler(loginData);
      router.push("/");
    } catch (err) {
      setError(err.message);
      setInputErrors({ email: true, password: true });
      // Set input errors based on the error message
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setInputErrors((prevErrors) => ({ ...prevErrors, [name]: true }));
    }
    if (value) {
      setInputErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-center w-full h-full py-2 m-0 p-0 relative border-8">
        <form
          className="sm:w-full lg:w-1/2 flex flex-col items-center justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="email"
            onBlur={handleBlur}
            className={`${styles.input} ${
              inputErrors.email ? styles.error_input : ""
            }`}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onBlur={handleBlur}
            className={`${styles.input} ${
              inputErrors.password ? styles.error_input : ""
            }`}
            onChange={handleChange}
          />
          <button type="submit" className={styles.btn}>
            LOGIN
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <Link href="/register" className="relative top-2 text-xl">
            not registered yet?
            <span className={styles.register}>register here</span>
          </Link>
          {successMessage && <p>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;

