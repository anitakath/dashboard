import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./Details.module.css";
import { useSelector } from "react-redux";

const DailyDetails = () => {
  const allSupabaseSports = useSelector(
    (state) => state.sport.allSupabaseSports
  );
  const router = useRouter();
  const { id } = router.query;

  // Function for filtering entries by date
  const filterEntriesByDate = (dateString) => {
    // Conversion of the date string into a date object
    const [day, month] = dateString.split(/(?<=\d)(?=[A-Z])/); // Separates e.g. ‘25APRIL’ into [‘25’, ‘APRIL’]
    const monthMap = {
      JANUARY: 0,
      FEBRUARY: 1,
      MARCH: 2,
      APRIL: 3,
      MAY: 4,
      JUNE: 5,
      JULY: 6,
      AUGUST: 7,
      SEPTEMBER: 8,
      OKTOBER: 9,
      NOVEMBER: 10,
      DECEMBER: 11,
    };

    const targetDate = new Date(
      2024,
      monthMap[month.toUpperCase()],
      parseInt(day)
    );

    return {
      targetDate,
      entries: allSupabaseSports.filter((entry) => {
        const entryDate = new Date(entry.created_at);
        return (
          entryDate.getFullYear() === targetDate.getFullYear() &&
          entryDate.getMonth() === targetDate.getMonth() &&
          entryDate.getDate() === targetDate.getDate()
        );
      }),
    };
  };

  // Filter the entries for the given day (e.g. ‘25APRIL’)
  const { targetDate, entries: filteredEntries } = id
    ? filterEntriesByDate(id)
    : { targetDate: null, entries: [] };

  const formattedDate = targetDate
    ? `${targetDate.getDate()} ${targetDate.toLocaleString("en-US", {
        month: "long",
      })} ${targetDate.getFullYear()}`
    : "";

  return (
    <div className="w-full h-screen  m-0 md:p-14 ">
      <div className="flex w-full border-2 h-full overflow-scroll py-2 m-0 p-0 relative z-20">
        <div className=" absolute w-full h-full m-0  z-0 top-0">
          {/* future image div*/}
        </div>
        <div className="absolute w-full h-full z-10 top-0">
          <Link href="/" className=" absolute m-2 p-2 cursor-pointer">
            <FontAwesomeIcon icon={faArrowLeft} className="font_purple" />
          </Link>
        </div>

        <div className="m-4 p-4 pl-14  w-full ">
          <h1 className="text-xl m-4 "> details - {formattedDate} </h1>

          <div className="my-10">
            {filteredEntries &&
              filteredEntries.map((entry, idx) => (
                <div key={entry.id} className={styles.entry_div}>
                  <h1>{entry.title}</h1>
                  <p> {entry.entry}</p>
                </div>
              ))}
          </div>

          <div className="my-4  flex-col">
            <h1 className="text-xl m-4 "> a 5 year story</h1>
            <div className="flex justify-evenly">
              <div className={styles.historical_entry_div}>
                <h2>2019</h2>
                <p>*coming soon*</p>
              </div>
              <div className={styles.historical_entry_div}>
                <h2>2020</h2>
                <p>*coming soon*</p>
              </div>
              <div className={styles.historical_entry_div}>
                <h2>2021</h2>
                <p>*coming soon*</p>
              </div>
              <div className={styles.historical_entry_div}>
                <h2>2022</h2>
                <p>*coming soon*</p>
              </div>
              <div className={styles.historical_entry_div}>
                <h2>2023</h2>
                <p>*coming soon*</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyDetails;
