
import styles from './UserImage.module.css'
const UserImage = () =>{


    return (
      <div className='hidden relative lg:flex'>
        <p
          className={styles.user_image}
          style={{ backgroundColor: "var(--purpleDarkHover)" }}
        ></p>
      </div>
    );
}

export default UserImage

