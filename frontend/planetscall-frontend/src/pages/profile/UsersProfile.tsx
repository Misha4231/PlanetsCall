import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { useAuth } from '../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import {User} from './types';
import { getAddAttendance, getAnotherUser } from '../../services/userService';
import { getFriends, addFriend, removeFriend  } from '../../services/communityService';
import Footer from '../../components/Footer/Footer';

const UsersProfile = () => {
  const { userName } = useParams<{ userName: string }>();
  const { user, isAuthenticated, token } = useAuth();  
  const [anotherUser, setAnotherU] = useState<User | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userName) return;
      try {
        const authToken = token || '';
        const userData = await getAnotherUser(authToken, userName);
        setAnotherU(userData);
        console.log('Attendance Data:', anotherUser);
      } catch (err: any) {
        console.error('Error fetching attendance:', err.message);
      }
    };

    fetchAttendance();
  }, [userName, token]);


  const handleAddFriend = async () => {
    if (!token || !anotherUser) return;
    try {
      await addFriend(token, anotherUser.username);
      alert('Friend added!');
    } catch (err) {
      console.error(err);
      alert('Failed to add friend.');
    }
  };

  return (
    <div>
      <Header/>
      <h3>Inny użytkownik</h3>
      <button onClick={handleAddFriend}>Dodaj do Znajomych</button>
      <main>
        <h3>Username: {anotherUser?.username}</h3>
        <h3>Email: {anotherUser?.email}</h3>
        <div className="profileImg">
          <img className="profileImg" src={anotherUser?.profile_image} alt="User profile" />
        </div>
        <div className="name">
          <h3>{anotherUser?.username}</h3>
          <p>{anotherUser?.description}</p>
        </div>
        <div className="stats">
          <p><strong>Points:</strong> {anotherUser?.points}</p>
          <p><strong>Theme Preference:</strong> {anotherUser?.theme_preference === 0 ? 'Light' : 'Dark'}</p>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default UsersProfile
