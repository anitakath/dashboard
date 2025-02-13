import { motion } from "framer-motion";
import styles from "./RandomSportImagesGrid.module.css";

const RandomSportImagesGrid = () => {
  const items = Array.from({ length: 9 }); // Erstelle ein Array mit 9 Elementen

  return (
    <div className={styles.container}>
      {items.map((_, index) => (
        <motion.div
          key={index}
          className={styles.item}
          initial={{ opacity: 0, y: -20 }} // Startzustand (unsichtbar und leicht nach oben verschoben)
          animate={{ opacity: 1, y: 0 }} // Endzustand (sichtbar und in Position)
          transition={{ duration: 0.5, delay: index * 0.1 }} // Verzögerung basierend auf dem Index
        ></motion.div>
      ))}
    </div>
  );
};

export default RandomSportImagesGrid;