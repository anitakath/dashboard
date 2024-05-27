import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


//COMPONENTS
import Dashboard from "@/components/Dashboard/Dashboard";

export default function Home() {
  return (
    <div className="w-screen h-screen m-0 p-10">
      <Dashboard />
    </div>
  );
}
