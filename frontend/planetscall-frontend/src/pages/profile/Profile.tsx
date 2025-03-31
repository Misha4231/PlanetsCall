import React, { useState, useEffect, useContext } from 'react'
import Footer from '../../components/Footer/Footer';
import { useNavigate, useLocation, Link  } from 'react-router-dom';

import Header from '../../components/shared/Header';
import { ThemeType, useAuth } from '../../context/AuthContext';
import { convertBase64ToImageUrl } from '../../services/imageConvert';




const Profile :React.FC = () => {
  // const [user, setUser] = useState<User | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, loadingUser } = useAuth();
  const navigate = useNavigate();
  

  const formatLastLogin = (date: Date | string | undefined): string => {
    if (!date) return 'Never logged in';
    const loginDate = new Date(date);
    return loginDate.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingUser) {
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

    const getTypeName = (type: ThemeType): string  => {
      switch(type) {
          case 0: return 'Ciemny';
          case 1: return 'Jasny';
          case 2: return 'Mieszany';
      }
  };


  return (
    <div className="profile"> 
    
      <Header/>
      <main>
        <button><Link to="/profile/settings">Edytuj ustawienia</Link></button>
        <h3>{user.username}</h3>
        {user.isAdmin === true && (<h5>Admin</h5> )}
        <div className="profileImg">
          {/* <img 
                className="profile-image" 
                src={user.profileImage && convertBase64ToImageUrl(user.profileImage)} 
                alt={`Profil ${user.username}`} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-profile.png';
                }}
              /> */}
        </div>
        <div className="name">
          <p>{user.description}</p>
        </div>
        <div className="stats">
          <p><strong>Points:</strong> {user.points}</p>
          <p><strong>Last Login:</strong> {user.lastLogin?.toString()}</p>
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
