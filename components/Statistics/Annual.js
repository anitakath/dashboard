import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Annual.module.css'
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';
import { useTopSportsByDuration } from '@/custom-hooks/Statistics/useStatistics';
//COMPONENTS
import FirstSection from './FirstSection/FirstSection';
import SecondSection from './SecondSection/SecondSection';
import ThirdSection from './ThirdSection/ThirdSection';
import RandomSportImagesGrid from './FourthSection.js/RandomSportImagesGrid';
import useFetchEntries from '@/custom-hooks/entries/useFetchEntries';
import { setFilteredEntriesByCurrentSportAndDate } from "@/store/sportReducer";
import { setAllSportsFromSupabase } from "@/store/sportReducer";


const Annual = ({ date, setDate}) => {
  const [showBarChart, setShowBarChart] = useState(null)
  const videoRef = useRef(null);
  const allSupabaseSports = useSelector((state) => state.sport.allSupabaseSports)
  const { sortedSportsByCount, resultArray } = useStatistics(
    allSupabaseSports,
    date
  );
  const userId = useSelector((state)=> state.auth.userId)
  const currentSport = useSelector((state) => state.sport.currentSport);
  const {fetchSportsData} = useFetchEntries();
  const dispatch = useDispatch();

  console.log(date)
  const topSportsByDuration = useTopSportsByDuration(allSupabaseSports, date);
  const showBarChartHandler = (item) =>{
    setShowBarChart(item)
  }

   // Effect for setting the playback speed
   useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 0.5; // Setze die Wiedergabegeschwindigkeit auf 0.75
    }

    const fetchData = async(userId) =>{
      const response = await fetchSportsData(userId, currentSport, date)

      const entries = await response.filter(
        (sport) => sport.name === currentSport
      );

      const filterEntries = await entries.filter((entry) => {
        const entryDate = new Date(entry.created_at);
        return (
          entryDate.getFullYear() === currentDate.year &&
          entryDate.getMonth() + 1 === currentDate.month // Hier direkt currentDate.month verwenden
        );
      });

      

      dispatch(setFilteredEntriesByCurrentSportAndDate(filterEntries));
      await dispatch(setAllSportsFromSupabase(response));
    }
    fetchData(userId);
}, []);



return (
    <div className={styles.staticsticsBodyContainer}>
      <video 
        ref={videoRef} 
        width="600" 
        controls 
        autoPlay 
        loop 
        muted 
        className={styles.backgroundVideo}   
        >
          <source src="/yoga.mp4" type="video/mp4" />
          Dein Browser unterstützt das Video-Tag nicht.
      </video>
   

      {/* -------------------------------- 1. TOP 3 SPORTS (HOURS + FREQUENCY) --------------------------------*/}
      {/* -------------------------------- 1. TOP 3 SPORTS (HOURS + FREQUENCY) --------------------------------*/}

      <FirstSection 
        date={date} 
        sortedSportsByCount={sortedSportsByCount}
        topSportsByDuration={topSportsByDuration}
        showBarChartHandler={showBarChartHandler}
        setDate={setDate}
        resultArray={resultArray}
        showBarChart={showBarChart}
        setShowBarChart={setShowBarChart}
      />
     


      {/* -------------------------------- 2. TOTAL HOURS OF  EACH SPORT  + BarChart! -------------------------------- */}
      {/* -------------------------------- 2. TOTAL HOURS OF  EACH SPORT  + BarChart! -------------------------------- */}
     
      <SecondSection 
        date={date} 
        resultArray={resultArray}
      />


      {/* -------------------------------- 3. REST DAYS !!! -------------------------------- */}
      {/* -------------------------------- 3. REST DAYS !!! -------------------------------- */}

      <ThirdSection date={date}/>



      {/* -------------------------------- 4. IMAGE GRID -------------------------------- */}
      {/* -------------------------------- 4. IMAGE GRID -------------------------------- */}

      <div className={styles.container}>
        <div className={styles.images_div}>
            <h1 className={styles.title}> your sports memories in {date.year} ...</h1>
            <RandomSportImagesGrid />
        </div>
      </div>
    </div>
  );
};

export default Annual