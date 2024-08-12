
import Link from "next/link";

const Diary = () =>{

    return (
      <div className="w-screen h-screen m-0 md:p-10">
        <div className="w-full h-full p-4 ">
          <div className="flex flex-col w-full h-full border-2 py-2 m-0 p-0 relative justify-center items-center">
            <h1 className="text-2xl my-4"> page in progress</h1>
            <div className="h-14 flex items-center justify-center w-ful">
              <Link
                href="/"
                className="text-red-400 hover:text-red-500 hover:text-xl transition duration-200 ease-in-out"
              >
                go back to the homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Diary;