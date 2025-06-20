import Image from 'next/image';
import styles from './UserImage.module.css'


const UserImage = () =>{

  return (
    <div className='relative lg:flex'>
      <Image src="/userImage.jpg" width={40} height={40} className={styles.userImage} alt="users profile image" />
    </div>
  );
}

export default UserImage

