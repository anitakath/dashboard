import Link from "next/link";
//STYLES
import styles from './Entry.module.css'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { formatDate } from "@/custom-hooks/formatDate";
//HOOKS
import { getMonth } from "@/custom-hooks/formatDate";
import { convertMinutesToHours } from "@/custom-hooks/minutesToHours";
import useDaysWithoutEntry from "@/custom-hooks/useDaysWithoutEntry";




const Entry = (props) => {
  const currentSport = useSelector((state) => state.sport.selectedSport);
  const filteredByDate = props.filteredByDate;
  const filteredEntries = props.filteredEntries;
  const sportsDurationByMonth = props.sportsDurationByMonth;
  const [openMonths, setOpenMonths] = useState({});
  const [entriesByMonth, setEntriesByMonth] = useState({});

  useEffect(() => {
    if (filteredByDate) {
      const updatedEntriesByMonth = {};
      const updatedEntriesByDay = {};

      filteredByDate.forEach((entry) => {
        const monthYear = `${getMonth(entry.created_at)} `;
        if (!updatedEntriesByMonth[monthYear]) {
          updatedEntriesByMonth[monthYear] = [];
        }
        updatedEntriesByMonth[monthYear].push(entry);

        const dayMonthYear = `${new Date(
          entry.created_at
        ).getDate()} ${getMonth(entry.created_at)} ${new Date(
          entry.created_at
        ).getFullYear()}`;
        if (!updatedEntriesByDay[dayMonthYear]) {
          updatedEntriesByDay[dayMonthYear] = [];
        }
        updatedEntriesByDay[dayMonthYear].push(entry);
      });

      setEntriesByMonth(updatedEntriesByMonth);
    }
  }, []);

  const sortedEntriesByMonth = Object.entries(entriesByMonth)
    .sort(([monthA], [monthB]) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months.indexOf(monthB.trim()) - months.indexOf(monthA.trim());
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const sumDurationsByMonth = {};
  for (const month in entriesByMonth) {
    const entries = entriesByMonth[month];
    const totalDurationInMinutes = entries.reduce(
      (acc, entry) => acc + entry.duration,
      0
    );
    const totalDurationInHours = convertMinutesToHours(totalDurationInMinutes);
    sumDurationsByMonth[month] = totalDurationInHours;
  }

  const toggleMonthEntries = (monthYear) => {
    setOpenMonths((prevState) => ({
      ...prevState,
      [monthYear]: !prevState[monthYear],
    }));
  };

  const filteredEntriesByMonth = {};

  for (const month in entriesByMonth) {
    const uniqueDates = new Set();
    const filteredEntries = entriesByMonth[month].filter((entry) => {
      const date = entry.created_at.split("T")[0];
      if (!uniqueDates.has(date)) {
        uniqueDates.add(date);
        return true;
      }
      return false;
    });

    filteredEntriesByMonth[month] = filteredEntries;
  }

  const dateData = useDaysWithoutEntry(filteredEntriesByMonth);

  const [restDays, setRestDays] = useState(null);

  useEffect(() => {
    setRestDays(dateData.restDaysPerMonth);
  }, [dateData]);



  // always sort sortedEntriesByMonth by date of creation of the respective entries.


  for (const month in sortedEntriesByMonth) {
    sortedEntriesByMonth[month].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }

  return (
    <div className={styles.container}>
      {currentSport != "all" && (
        <h1>
          total hours of being a sporty spice so far:
          <span> {sportsDurationByMonth}</span>
        </h1>
      )}
      {currentSport !== "all" &&
        filteredEntries.map((entry, index) => (
          <div
            className={styles.entry}
            key={index}
            style={{
              background: getComputedStyle(
                document.documentElement
              ).getPropertyValue(`--${entry.label}`),
            }}
          >
            <Link href={`/details/${entry.entryPath}`}>
              <div className={styles.link}>
                <p className="my-2 px-2 text-xs absolute right-4">
                  {formatDate(entry.created_at)}
                </p>
                <h2 className="text-2xl mb-4 mt-6 px-2 h-18">{entry.title}</h2>
                <p className="px-2 mb-4">{entry.entry}</p>
              </div>
            </Link>
          </div>
        ))}

      {Object.keys(sortedEntriesByMonth).map((monthYear) => (
        <div key={monthYear}>
          {currentSport === "all" && (
            <button
              className={styles.monthYear_header}
              onClick={() => toggleMonthEntries(monthYear)}
            >
              {monthYear}
            </button>
          )}
          {openMonths[monthYear] &&
            sortedEntriesByMonth[monthYear].map((entry, index) => (
              <div
                className={styles.entry}
                key={index}
                style={{
                  background: getComputedStyle(
                    document.documentElement
                  ).getPropertyValue(`--${entry.label}`),
                }}
              >
                <Link href={`/details/${entry.entryPath}`}>
                  <div className={styles.link}>
                    <p className="my-2 px-2 text-xs absolute right-4">
                      {formatDate(entry.created_at)}
                    </p>
                    <h2 className="text-2xl mb-4 mt-2 px-2">{entry.title}</h2>
                    <p className="px-2 mb-4">{entry.entry}</p>
                  </div>
                </Link>
              </div>
            ))}
          {currentSport === "all" && (
            <div>
              <p className={styles.totalHours_p}>
                Total hours of sport:
                <span className={styles.totalHours_span}>
                  {sumDurationsByMonth[monthYear]}
                </span>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Entry;


