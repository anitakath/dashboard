import { useEffect, useState } from 'react';
import styles from './QuoteSlider.module.css';
import NextImage from 'next/image';

const QuotesSlider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lade Bilder aus JSON-Datei
  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/quotes/quotes.json');
        if (!response.ok) throw new Error('Failed to load quotes');
        const data = await response.json();
        setImages(data.images.map((image) => `/quotes/${image}`));
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Auto-Slider alle 4 Sekunden
  useEffect(() => {
    if (images.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [images]);

  // Preload nächstes Bild
  useEffect(() => {
    if (images.length === 0) return;

    const nextIndex = (currentIndex + 1) % images.length;
    const img = new Image(); // native Image-Objekt
    img.src = images[nextIndex];
  }, [currentIndex, images]);

  return (
    <div className={styles.sliderContainer}>
      {images.length > 0 && (
        <div className={styles.slider}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
            >
              <NextImage
                src={image}
                alt={`Quote ${index}`}
                fill
                loading={index === 0 ? 'eager' : 'lazy'}
                priority={index === 0}
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotesSlider;
