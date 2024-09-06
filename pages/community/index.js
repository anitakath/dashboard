
import Link from 'next/link'
import styles from './Community.module.css'
//COMPONENTS
import BoardHeader from '@/components/Main/BoardHeader/BoardHeader'

const Community = (props) =>{


    return (
      <div className="w-full h-screen m-0 md:p-14">
        <div className="flex flex-col w-full border-2 h-full overflow-scroll py-2 m-0 p-0 relative z-20">
          <BoardHeader />

          <div className="border-2 p-2">
            community field:
            <br />
            <br />
            show registered (+online) Users
            <br />
            <br />
            - "view profile" click leads to /community/user-id
            <br />
            <br />
            - "add friend"
            <br />
            <br />
            - "message user"
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            show statistics of the (anonymous) community and the users with whom
            the user is friends:
            <br />
            <br />
            - popular sports
            <br />
            <br />
            - total diary entries made
            <br />
            <br />
            - total hours of sport completed
            <br />
            <br />- total registered users -
          </div>
        </div>
      </div>
    );
}

export default Community