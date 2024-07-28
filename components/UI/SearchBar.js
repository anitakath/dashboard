

//STYLES
import styles from './SearchBar.module.css'


const SearchBar = () =>{

    const submitHandler = (e) =>{

        e.preventDefault()

    }

    return (
    <div className="mx-2 my-8" onSubmit={submitHandler}> 
    <form className={styles.form}>
        <label className="hidden"> search</label>
        <input type="search" placeholder="search" className={styles.search_input}></input>
        <button className={styles.submit_btn}> 🔍 </button>
    </form>
    
    </div>
    )}

export default SearchBar