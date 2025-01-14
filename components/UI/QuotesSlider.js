import { useEffect, useState } from 'react';
import styles from './QuoteSlider.module.css';
import Image from 'next/image';

const QuotesSlider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      const response = await fetch('/quotes/quotes.json');
      const data = await response.json();
      setImages(data.images.map(image => `/quotes/${image}`));
    };

    loadImages();
  }, []); 

  useEffect(() => {
    if (images.length === 0) return; 

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); 

    return () => clearInterval(intervalId); 
  }, [images]); 


  return (
    <div className={styles.sliderContainer}>
      {images.length > 0 && (
        <div className={styles.slider}>
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            >
              <Image 
                src={image} 
                alt={`Quote ${index}`} 
                layout="fill" 
                objectFit="cover" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotesSlider;