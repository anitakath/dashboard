import { useState, useEffect, useRef } from 'react';
import styles from './Annual.module.css'
//CUSTOM HOOKS
import useStatistics from '@/custom-hooks/Statistics/useStatistics';
import { useTopSportsByDuration } from '@/custom-hooks/Statistics/useStatistics';
import useConvertTimes from '@/custom-hooks/times_and_dates/useConvertTimes';
//COMPONENTS
import FirstSection from './FirstSection/FirstSection';
import SecondSection from './SecondSection/SecondSection';
import ThirdSection from './ThirdSection/ThirdSection';
import RandomSportImagesGrid from './FourthSection.js/RandomSportImagesGrid';

const Annual = ({ allSupabaseSports, date, setDate}) => {
  const [showBarChart, setShowBarChart] = useState(null)
  //const [isScrolled, setIsScrolled] = useState(false)
  const [showFiveYearHistory, setShowFiveYearHistory] = useState({
    favourites: false,
    totalHours: false,
    restDays: false,
  })
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(true);

  const { sortedSportsByCount, resultArray } = useStatistics(
    allSupabaseSports,
    date
  );
  const { convertMinutesToHours } = useConvertTimes();
  const topSportsByDuration = useTopSportsByDuration(allSupabaseSports, date);

  const showBarChartHandler = (item) =>{
    setShowBarChart(item)

  }

   // Effect for setting the playback speed
   useEffect(() => {
    if (videoRef.current) {
        videoRef.current.playbackRate = 0.5; // Setze die Wiedergabegeschwindigkeit auf 0.75
    }
}, []);



return (
    <div className={styles.staticsticsBodyContainer}>

      {/* VIDEO IN staticsticsBodyContainer  */}
      <video 
        ref={videoRef} 
        width="600" 
        controls 
        autoPlay 
        loop 
        muted 
        className={styles.backgroundVideo}
        onMouseEnter={() => setShowControls(false)} // Entferne die Steuerung beim Hover
        onMouseLeave={() => setShowControls(true)}     
        >
          <source src="/yoga.mp4" type="video/mp4" />
          Dein Browser unterstützt das Video-Tag nicht.
      </video>
   

      {/* -------------------------------- 1. TOP 3 SPORTS (HOURS + FREQUENCY) --------------------------------*/}
      {/* -------------------------------- 1. TOP 3 SPORTS (HOURS + FREQUENCY) --------------------------------*/}

      <FirstSection 
        date={date} 
        sortedSportsByCount={sortedSportsByCount}
        showBarChart={showBarChart}
        topSportsByDuration={topSportsByDuration}
        showBarChartHandler={showBarChartHandler}
        setDate={setDate}
        resultArray={resultArray}
        setShowBarChart={setShowBarChart}
      />
     


      {/* -------------------------------- 2. TOTAL HOURS OF  EACH SPORT  + BarChart! -------------------------------- */}
      {/* -------------------------------- 2. TOTAL HOURS OF  EACH SPORT  + BarChart! -------------------------------- */}
     
      <SecondSection 
        date={date} 
        resultArray={resultArray}
        setShowFiveYearHistory={setShowFiveYearHistory}
        showFiveYearHistory={showFiveYearHistory}
      />


      {/* -------------------------------- 3. REST DAYS !!! -------------------------------- */}
      {/* -------------------------------- 3. REST DAYS !!! -------------------------------- */}

      <ThirdSection date={date}/>



      {/* -------------------------------- 4. IMAGE GRID -------------------------------- */}
      {/* -------------------------------- 4. IMAGE GRID -------------------------------- */}

      <div className={styles.container}>
        <div className={styles.images_div}>
            your memories in {date.year} ...
            <RandomSportImagesGrid />
        </div>
      </div>
    </div>
  );
};

export default Annual