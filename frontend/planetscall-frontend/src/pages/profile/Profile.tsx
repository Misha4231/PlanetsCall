import React, { useState, useEffect} from 'react'
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import HeaderProfile from '../../components/Header/Profile/HeaderProfile';
import {User} from './types';

import { getPublicContent } from "../../services/userService";

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
            <h3>{user.username}</h3>
            <p>{user.description}</p>
          </p>
        </div>
        <div className="stats">
          <p><strong>Points:</strong> {user.points}</p>
          <p><strong>Theme Preference:</strong> {user.theme_preference === 0 ? 'Light' : 'Dark'}</p>
          <p><strong>Last Login:</strong> {new Date(user.last_login_at).toLocaleDateString()}</p>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default Profile
