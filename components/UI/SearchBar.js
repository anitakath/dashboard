

//STYLES
import styles from './SearchBar.module.css'

import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {



  return (
    <div className={styles.form}>
      <input
        type="text"
        placeholder="search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.search_input}
      />
       <button className={styles.submit_btn}> 🔍 </button>
    </div>
  );
};

export default SearchBar;
