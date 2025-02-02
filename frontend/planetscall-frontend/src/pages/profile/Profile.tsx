import React, { useState, useEffect, useContext } from 'react'
import Footer from '../../components/Footer/Footer';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
import {User} from './types';

import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';




const Profile :React.FC = () => {
  // const [user, setUser] = useState<User | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Ładowanie danych użytkownika...</div>;
  }  
  
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>

    </div>);   
  }

  if (!user) {
    return <p>Ładowanie danych użytkownika...</p>;
  }



  return (
    <div className="profile"> 
    
      <Header/>
      <main>
        <button><Link to="/profile/settings">Edytuj ustawienia</Link></button>
        <h3>Username: {user.username}</h3>
        <h3>Email: {user.email}</h3>
        <div className="profileImg">
          <img className="profileImg" src={user.profile_image} alt="User profile" />
        </div>
        <div className="name">
          <h3>{user.username}</h3>
          <p>{user.description}</p>
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
  /*
          <div className="profileImg">
          <img className="profileImg" src={user.profile_image} alt={user.profile_image} />
        </div>
        <div className="name">
            <h3>{user.username}</h3>
            <p>{user.description}</p>
        </div>
        <div className="stats">
          <p><strong>Points:</strong> {user.points}</p>
          <p><strong>Theme Preference:</strong> {user.theme_preference === 0 ? 'Light' : 'Dark'}</p>
          <p><strong>Last Login:</strong> {new Date(user.last_login_at).toLocaleDateString()}</p>
        </div>
  */
  
}

export default Profile
