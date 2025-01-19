import React from 'react';
import styles from './Tooltip.module.css'; // Stelle sicher, dass du die CSS-Datei importierst

const Tooltip = ({ text, position }) => {
  return (
    <div className={styles.tooltip}>
      {text}
    </div>
  );
};

export default Tooltip;