import Link from "next/link";
import { useDispatch } from "react-redux";
import { setLogin } from "@/store/authReducer";

import styles from './Login.module.css'
const Login = () =>{

    const dispatch = useDispatch();

    const LoginHandler = () =>{

        dispatch(setLogin(true))
    }


    return (
      <div className="w-full h-full p-4 ">
        <div className="flex justify-center w-full h-full py-2 m-0 p-0 relative border-8">
          <form className=" w-1/2 flex flex-col items-center justify-center" onSubmit={LoginHandler}>
            <input type="text" placeholder="name" className={styles.input}></input>
            <input type="text" placeholder="password" className={styles.input}></input>
            <button className={styles.btn}>LOGIN</button>
          </form>
        </div>
      </div>
    );
}

export default Login;