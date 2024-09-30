
import styles from './UserImage.module.css'

const UserImageMobile = () =>{


    return (
      <div className="absolute right-2 top-0 flex lg:hidden">
        <p
          className={styles.user_image}
          style={{ backgroundColor: "var(--purpleDarkHover)" }}
        ></p>
      </div>
    );
}

export default UserImageMobile