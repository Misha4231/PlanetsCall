import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { imageUrl } from '../../services/imageConvert';
import { getFriends } from '../../services/communityService';
import '../../stylePage/profile.css';

const Profile: React.FC = () => {
  const { user, isAuthenticated, loadingUser, token } = useAuth();
  const [friends, setFriends] = useState<{ username: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalFriends, setTotalFriends] = useState<number>(0);

useEffect(() => {
    if (!isAuthenticated || !token) return;  
    fetchFriends();
  }, [isAuthenticated, token]);
  
  const fetchFriends = async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const data = await getFriends(token, 1, "");
      setFriends(data);
      console.log(data);
      if(data.length  == 0) {
        setTotalFriends(0);
      }else{
        setTotalFriends(data.length);
      }
      console.log(totalFriends)
    } catch (err:any) {
    } finally {
      setLoading(false);
    }
  };

  const formatLastLogin = (date: Date | string | undefined): string => {
    if (!date) return 'Nigdy nie logowano';
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
    return <div className="loading">Ładowanie danych użytkownika...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="app-container">
        <Header/>
        <section className="blockCode">
          <p className="error-message">Użytkownik nie jest zalogowany.</p>
        </section>
        <Footer/>
      </div>
    );   
  }

  /*
  <div className="form-group full-width">
                <label className="form-label">Zdjęcie Profilowe:</label>
                {previewImage && (
                  <div className="image-preview">
                    <img 
                      src={previewImage} 
                      alt="Podgląd zdjęcia profilowego" 
                      className="preview-image"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="form-input"
                />
              </div>
               */

  return (
    <div className="app-container dark-theme">
      <Header/>
      <section className="blockCode profile-container">
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <img 
                src={imageUrl() + user.profileImage} 
                alt={`Profilowe ${user.username}`}
                className="avatar-image"
              />
              <div className="avatar-controls">
                <button className="edit-button">Zmień awatar</button>
                <button className="edit-button">Zarządzaj itemami</button>
              </div>
            </div>
            
            <div className="profile-info">
              <div className="username-section">
                <h2>{user.username}</h2>
                {user.isAdmin && <span className="admin-badge"><i className="fas fa-crown"></i>Admin</span>}
                <Link to="/profile/settings" className="settings-link">
                  <button className="edit-button">Edytuj profil</button>
                </Link>
              </div>
              
              {(user.firstName || user.lastName) && (
                <p className="user-name">
                  {user.firstName} {user.lastName}
                </p>
              )}
              
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">Punkty:</span>
                  <span className="stat-value">{user.points}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Liczba Znajomych:</span>
                  <span className="stat-value">{totalFriends}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Ostatnie logowanie:</span>
                  <span className="stat-value">{formatLastLogin(user.lastLogin)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Postęp:</span>
                  <span className="stat-value">{user.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h3>Opis</h3>
              <div className="detail-content">
                {user.description ? (
                  <p>{user.description}</p>
                ) : (
                  <p className="no-data">Nie dodano jeszcze opisu.</p>
                )}
              </div>
            </div>

            {(user.instagramLink || user.linkedinLink || user.youtubeLink) && (
              <div className="detail-section">
                <h3>Linki</h3>
                <div className="social-links">
                  <ul>
                    {user.instagramLink && (
                      <li>
                        <a href={user.instagramLink} className="social-link" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-instagram"></i> Instagram
                        </a>
                      </li>
                    )}
                    {user.linkedinLink && (
                      <li>
                        <a href={user.linkedinLink} className="social-link" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                      </li>
                    )}
                    {user.youtubeLink && (
                      <li>
                        <a href={user.youtubeLink} className="social-link" target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-youtube"></i> YouTube
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>          
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default Profile;