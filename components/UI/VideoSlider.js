import { useEffect, useState } from 'react';
import styles from './VideoSlider.module.css';

const VideoSlider = () => {
    const [videos, setVideos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadVideos = async () => {
            const videoNames = Array.from({ length: 2 }, (_, i) => `${String.fromCharCode(97 + i)}-pexel.mp4`);
            const videoPaths = videoNames.map(name => `/videos/${name}`);
            setVideos(videoPaths);
        };
        loadVideos();
    }, []);

    useEffect(() => {
        if (videos.length === 0) return;

        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
        }, 5000); 

        return () => clearInterval(intervalId);
    }, [videos]);

    return (
        <div className={styles.sliderContainer}>
        

            {videos.length > 0 && 
                videos.map((video, index) => (
                    <div key={index} className={styles.slide} style={{ transform: `translateY(-${currentIndex * 100}%)`}}>
                        <video src={video} autoPlay loop muted />
                    </div>
                ))
            }
         
           
            <div className={styles.actionButtons}>
                <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length)}>Up</button>
                <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length)}>Down</button>
            </div>
        </div>
    );
};

export default VideoSlider;