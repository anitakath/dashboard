
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";


const AddSportAlert = () =>{

    return (
      <div>
        <h1 className=" bg-red-200 p-2" style={{ color: "var(--purpleDark)" }}>
          You have not yet added an entry. Start now by pressing the plus button
        </h1>
        <FontAwesomeIcon icon={faArrowDown} className=" relative top-4 left-3.5 text-2xl text-zinc-200"/>
      </div>
    );
}

export default AddSportAlert