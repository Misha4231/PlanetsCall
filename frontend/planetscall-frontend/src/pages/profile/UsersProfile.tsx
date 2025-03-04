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
  const [anotherUser, setAnotherUser] = useState<Friend | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData  = async () => {
      if (!userName) return;
      if(token == null) return;
      try {
        setLoading(true);
        setError(null);
        
        
        const userData = await getAnotherUser(token, userName);
        setAnotherUser(userData);

        
        const friendsData = await getFriends(token, 1, '');

        const isAlreadyFriend = friendsData.some((friend: Friend) => friend.username === userName);
        setIsFriend(isAlreadyFriend);

      } catch (err: any) {
        console.error('Error fetching attendance:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName, token]);


  const handleAddFriend = async () => {
    if (!token || !anotherUser) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await addFriend(token, anotherUser.username);
      setIsFriend(true);
      setSuccess('Znajomy został dodany pomyślnie.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!token || !anotherUser) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await removeFriend(token, anotherUser.username);
      setIsFriend(false);
      setSuccess('Znajomy został usunięty pomyślnie.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <h3>Inny użytkownik</h3>
      {isAuthenticated && (
        <>
          {!isFriend ? (
            <button onClick={handleAddFriend} disabled={loading}>
              {loading ? 'Dodawanie...' : 'Dodaj do Znajomych'}
            </button>
          ) : (
            <button onClick={handleRemoveFriend} disabled={loading}>
              {loading ? 'Usuwanie...' : 'Usuń znajomego'}
            </button>
          )}
        </>
      )}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <main>
        <h3>Username: {anotherUser?.username}</h3>
        <h3>Email: {anotherUser?.email}</h3>
        <div className="profileImg"></div>
        <div className="name">
          <h3>{anotherUser?.username}</h3>
        </div>
        <div className="stats">
          <p><strong>Points:</strong> {anotherUser?.points}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UsersProfile
