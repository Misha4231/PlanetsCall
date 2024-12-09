import React, { useState } from 'react'
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import HeaderProfile from '../../components/Header/Profile/HeaderProfile';
import {User, Achievement} from './types';

interface ProfileProps{
  user: User;
}



const Profile :React.FC<ProfileProps> = ({user}) => {

  return (
    <div className="profile">
      <HeaderProfile/>
    
      <main>
        <div className="profileImg">
          <img className="profileImg" src={user.profile_image} alt={user.profile_image} />
        </div>
        <div className="name">
          <p>
            {user.username}
          </p>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default Profile
