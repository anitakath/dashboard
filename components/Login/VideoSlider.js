import { useEffect, useState } from "react";
import styles from './VideoSlider.module.css';

const VideoSlider = () => {
  const [currentVideo, setCurrentVideo] = useState(0); // 0 für Video A, 1 für Video B

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Wechselt alle 5 Sekunden

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center w-full h-full m-0 p-0 relative border-2 overflow-hidden">
      <video
        src="/videos/a-pexel.mp4"
        autoPlay
        loop
        muted
        className={`${styles.video} ${currentVideo === 0 ? styles.slideOut : styles.slideIn}`}
      />
      <video
        src="/videos/b-pexel.mp4"
        autoPlay
        loop
        muted
        className={`${styles.video} ${currentVideo === 1 ? styles.slideIn : styles.slideOut}`}
      />
    </div>
  );
};

export default VideoSlider;