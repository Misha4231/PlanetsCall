import React, { useState, useEffect} from 'react'
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import {User} from './types';

import { getUserBoard } from "../../services/userService";
import Header from '../../components/shared/Header';

interface ProfileProps{
  user: User;
}



const Profile :React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserBoard();
        setUser(response.data); 
      } catch (err: any) {
        setError(err.message || 'Nie udało się pobrać danych użytkownika.');
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>Błąd: {error}</p>;
  }

  if (!user) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  return (
    <div className="profile">
    
      <Header/>
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
