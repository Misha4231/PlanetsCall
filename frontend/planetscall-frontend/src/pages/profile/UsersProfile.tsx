import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { useAuth } from '../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import {User} from './types';
import  {Friend} from "../../types/Friend";
import { getAddAttendance, getAnotherUser } from '../../services/userService';
import { getFriends, addFriend, removeFriend  } from '../../services/communityService';
import Footer from '../../components/Footer/Footer';

const UsersProfile = () => {
  const { userName } = useParams<{ userName: string }>();
  const { user, isAuthenticated, token } = useAuth();  
  const [anotherUser, setAnotherU] = useState<Friend  | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userName) return;
      try {
        const authToken = token || '';
        const userData = await getAnotherUser(authToken, userName);
        setAnotherU(userData);
        //console.log('Attendance Data:', anotherUser);       

        const friendsData = await getFriends(authToken);
        setFriends(friendsData);
        console.log(friends);

        const isAlreadyFriend = friendsData.some((friend: Friend) => friend.username === userName);
        setIsFriend(isAlreadyFriend);
        
       //console.log(friendsData[0].username);
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
      {!isFriend && isAuthenticated && (
        <button onClick={handleAddFriend}>Dodaj do Znajomych</button>
      )}
      <main>
        <h3>Username: {anotherUser?.username}</h3>
        <h3>Email: {anotherUser?.email}</h3>
        <div className="profileImg">
          {/* //<img className="profileImg" src={anotherUser?.profileImage} alt="User profile" /> */}
        </div>
        <div className="name">
          <h3>{anotherUser?.username}</h3>
          {/* <p>{anotherUser?.description}</p> */}
        </div>
        <div className="stats">
          <p><strong>Points:</strong> {anotherUser?.points}</p>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default UsersProfile
