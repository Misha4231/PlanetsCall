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
  const [page, setPage] = useState<number>(1);
  const [newFriend, setNewFriend] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
  
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const friendsData = await getFriends(token, page, search);
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
  }, [isAuthenticated, token, page, search]);
  

  const handleAddFriend = async () => {
    if (!newFriend.trim()) return;

    if (friends.some(friend => friend.username === newFriend)) {
      setError('Ten użytkownik jest już na liście znajomych.');
      return;
    }
    try {
      setLoading(true);
      setError(null); 
      setSuccess(null);

      await addFriend(token as string, newFriend);
      const updatedFriends = await getFriends(token as string, page, search);
      setFriends(updatedFriends.sort((a:any, b:any) => a.username.localeCompare(b.username)));
      setNewFriend('');
      setSuccess('Pomyślnie dodano znajomego.');
    } catch (err: any) {
      console.error('Error:', err); 
      setError(err.message || 'Nie udało się dodać znajomego.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (username: string) => {
    try {
      setLoading(true);
      setError(null); 
      setSuccess(null);

      await removeFriend(token as string, username);
      const updatedFriends = await getFriends(token as string, page, search);
      setFriends(updatedFriends.sort((a:any, b:any) => a.username.localeCompare(b.username)));
      setSuccess('Pomyślnie usunięto znajomego.');
    } catch (err: any) {
      setError(err.message || 'Nie udało się usunąć znajomego.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <h1>Lista znajomych ({friends.length})</h1>
      
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <input
        type="text"
        placeholder="Nazwa użytkownika"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
      />
      <button onClick={handleAddFriend} disabled={loading}>
        {loading ? 'Ładowanie...' : 'Dodaj'}
      </button>

      {loading && <p>Ładowanie...</p>}
      
      <div>
        {/* <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}>
          Poprzednia strona
        </button>
        <span>Strona {page}</span>
        <button onClick={() => setPage(prev => prev + 1)}>Następna strona</button> */}
      </div>
    </div>
  );
};

export default Friends;
