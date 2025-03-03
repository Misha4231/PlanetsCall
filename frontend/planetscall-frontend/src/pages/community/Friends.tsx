import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import  {Friend} from "./communityTypes";
import { getFriends, addFriend, removeFriend } from '../../services/communityService';

const Friends = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [friends, setFriends] = useState<{ username: string }[]>([]);
  const [search, setSearch] = useState<string>('');
  const [newFriend, setNewFriend] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
  
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const friendsData = await getFriends(token);
        console.log('Odebrane dane:', friendsData); 
  
        if (!Array.isArray(friendsData)) {
          throw new Error('Błędny format danych, oczekiwano tablicy w items.');
        }
  
        setFriends(friendsData.sort((a, b) => a.username.localeCompare(b.username)));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFriends();
  }, [isAuthenticated, token]);
  

  const handleAddFriend = async () => {
    if (!newFriend.trim()) return;

    try {
      setLoading(true);
      await addFriend(token as string, newFriend);
      setFriends(prev => [...prev, { username: newFriend }].sort((a, b) => a.username.localeCompare(b.username)));
      setNewFriend('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (username: string) => {
    try {
      setLoading(true);
      await removeFriend(token as string, username);
      setFriends(prev => prev.filter(friend => friend.username !== username));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <h1>Lista znajomych ({friends.length})</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <input
        type="text"
        placeholder="Szukaj znajomych..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {friends
          .filter(friend => friend.username.toLowerCase().includes(search.toLowerCase()))
          .map(friend => (
            <li key={friend.username}>              
              <Link to={`/user/${friend.username}`}>{friend.username}</Link>
              <button onClick={() => handleRemoveFriend(friend.username)}>Usuń</button>
            </li>
          ))}
      </ul>

      <h2>Dodaj znajomego</h2>
      <input
        type="text"
        placeholder="Nazwa użytkownika"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
      />
      <button onClick={handleAddFriend}>Dodaj</button>

      {loading && <p>Ładowanie...</p>}
    </div>
  );
};

export default Friends;
