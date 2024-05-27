
//STYLES
import styles from './AddEntryForm.module.css'

const AddEntryForm = () =>{

    const submitHandler = (e) =>{
        e.preventDefault();

        console.log('submitting...')
    }

    return ( 
      <form className=" my-2 p-2 flex flex-col" onSubmit={submitHandler}>
        <label className={styles.labels}> Title </label>
        <input
          type="text"
          placeholder="title"
          className={styles.inputs}
        ></input>

        <label className={styles.labels}> Text </label>
        <input type="text" placeholder="text" className={styles.inputs}></input>

        <label className={styles.labels}> Image </label>
        <input
          type="text"
          placeholder="upload image..."
          className={styles.inputs}
        ></input>

        <button className={styles.submit_btn}> submit </button>
      </form>
    );
}

export default AddEntryForm