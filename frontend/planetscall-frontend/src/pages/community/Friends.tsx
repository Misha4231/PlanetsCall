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
    fetchFriends();
  }, [isAuthenticated, token, page, search]);
  
  const fetchFriends = async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFriends(token, page, search);
      setFriends(data);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    if (!isAuthenticated || !token) return;
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await addFriend(token, newFriend);
      setSuccess('Znajomy został dodany pomyślnie.');
      setNewFriend('');
      fetchFriends();
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleRemoveFriend = async (username: string) => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await removeFriend(token, username);
        setSuccess('Znajomy został usunięty pomyślnie.');
        fetchFriends();
    } catch (err:any) {
      console.log("Wypisuje " + err + err.message + err.text );
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <h1>Twoi Znajomi ({friends.length})</h1>
      
      <div>
        <h2>Dodaj Znajomego</h2>
        <form onSubmit={handleAddFriend}>
          <input
            type="text"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            placeholder="Wpisz nazwę użytkownika"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Dodawanie...' : 'Dodaj Znajomego'}
          </button>
        </form>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
 
      <div>
        <h2>Lista Znajomych</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Wyszukaj znajomych"
        />
        {loading ? (
          <p>Ładowanie...</p>
        ) : friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.username}>
                  <Link to={`/user/${friend.username}`}>{friend.username}</Link>
                <button onClick={() => handleRemoveFriend(friend.username)} disabled={loading}>
                  Usuń
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak znajomych.</p>
        )}
      </div>

      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1 || loading}>
          Poprzednia strona
        </button>
        <span>Strona {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={friends.length === 0 || loading}>
          Następna strona
        </button>
      </div>
    </div>
  );
};

export default Friends;
