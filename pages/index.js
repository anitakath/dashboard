import Image from "next/image";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";


const inter = Inter({ subsets: ["latin"] });


//COMPONENTS
import Dashboard from "@/components/Dashboard/Dashboard";
import Login from "@/components/Login/Login";

export default function Home() {

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)


  console.log(isLoggedIn)
  return (
    <div className="w-screen h-screen m-0 md:p-10">
      {!isLoggedIn && <Login />}
      {isLoggedIn && <Dashboard />}
    </div>
  );
}
