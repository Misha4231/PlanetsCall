import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { imageUrl } from '../../services/imageConvert';
import { getFriends } from '../../services/communityService';
import styles from '../../stylePage/profile.module.css';
import NotAuthenticated from '../Additional/NotAuthenticated';
import { getAddAttendance, getUserSelectedItems } from '../../services/userService';
import Ecorus from '../../components/Ecorus';
import { getCategories, Items } from '../../services/shopService';
import Loading from '../Additional/Loading';

interface Category {
  id: number;
  title: string;
  image: string;
}


const Profile: React.FC = () => {
  const { user, isAuthenticated, loadingUser, token } = useAuth();
  const [friends, setFriends] = useState<{ username: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Items[]>([]);
  const [totalFriends, setTotalFriends] = useState<number>(0);

  
{ /* Get data about user Friends */} 
useEffect(() => {
    if (!isAuthenticated || !token) return;  

    fetchAllSelectedItems();
    fetchFriends();
    fetchAttendance();
  }, [isAuthenticated, token]);


  const fetchAttendance = async () => {
    try {
      if (!isAuthenticated || !token) return;  
      await getAddAttendance(token);
    } catch (err: any) {
      console.log(err);
    }
  };
  
  const fetchAllSelectedItems = async () => {
    if (!isAuthenticated || !token) return;  
    setLoading(true);
    try {
      const [categoriesData] = await Promise.all([
        getCategories(token),
      ]);
      setCategories(categoriesData);

      if (categoriesData.length != 0){
        const allItems: Items[] = [];
    
        for (const category of categoriesData) {
          const response = await getUserSelectedItems(token, category.id, 1);
          allItems.push(...response.items);
        }
    
        setSelectedItems(allItems);
      }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  {/* Function to search user's friends */}
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

  {/* Function to see last login data */}
  const formatLastLogin = (date: Date | string | undefined): string => {
    if (!date) return 'Nigdy nie logowano';
  
    const now = new Date();
    const loginDate = new Date(date);
    const diff = now.getTime() - loginDate.getTime();
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
  
    if (diffMinutes < 1) return 'przed chwilą';
    if (diffMinutes < 60) return `${diffMinutes} min temu`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'godzinę' : 'godziny'} temu`;
    if (diffDays === 1) return 'wczoraj';
    if (diffDays < 7) return `${diffDays} dni temu`;
    if (diffWeeks < 5) return `${diffWeeks} tygodni temu`;
    if (diffMonths < 12) return `${diffMonths} miesięcy temu`;
    return `${diffYears} lat temu`;
  };

  /*
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

  */
  

  if (loadingUser) {
    return <div className="loading">Ładowanie danych użytkownika...</div>;
  }

  if (!isAuthenticated || !user) {
    return (<NotAuthenticated/>
    );   
  }
  

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.profileContainer}>
        {loading ? (
          <Loading/>
        ) : (
          <div className={styles.profileContent}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                {user.profileImage ? (
                  <img
                    src={imageUrl() + user.profileImage}
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <i className="fas fa-user"></i>
                  </div>
                )}
                <div className={styles.avatarControls}>
                  {/*<button className={styles.editButton}>Zmień awatar</button>*/}
                  <Link to="/profile/ecorus"  className={styles.settingsLink}>
                    <button className={styles.editButton}>Zarządzaj itemami</button>
                  </Link>
                </div>
              </div>

              <div className={styles.flexMeBlock}>
                <section  className={styles.userData}>                    
                <div className={styles.profileInfo}>
                  <div className={styles.usernameSection}>
                    <h2>{user.username}</h2>
                    {user.isAdmin && (
                      <span className={styles.adminBadge}>
                        <i className="fas fa-crown"></i>Admin
                      </span>
                    )}
                    <Link to="/profile/settings" className={styles.settingsLink}>
                      <button className={styles.editButton}>Edytuj profil</button>
                    </Link>
                  </div>

                  {(user.firstName || user.lastName) && (
                    <p className={styles.userName}>
                      {user.firstName} {user.lastName}
                    </p>
                  )}

                <div className={styles.quickStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Punkty:</span>
                      <span className={styles.statValue}>{user.points}</span>
                    </div>
                    <Link to="/community/friends" className={`${styles.statItem} ${styles.hiddenLink}`}>
                      <span className={styles.statLabel}>Liczba Znajomych:</span>
                      <span className={styles.statValue}>{totalFriends}</span>
                    </Link>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Ostatnie logowanie:</span>
                      <span className={styles.statValue}>{formatLastLogin(user.lastLogin)}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Postęp:</span>
                      <span className={styles.statValue}>{user.progress} Level</span>
                    </div>
                  </div>  
                </div>
                </section>
                  
                  <div className={styles.ecorusContent}>
                    <div className={`${styles.profilePreviewImage}`}>
                        <div className={styles.profileImageWrapper}>
                            <Ecorus className={styles.profileEcorusImage} />
                            {selectedItems.map((item) => (
                            <div key={item.id}>
                                <img src={imageUrl() + item.image} alt={item.title} className={styles.profileCharacterClothes} />
                            </div>
                            ))}
                        </div>
                      </div>
                  </div>
                
                         
              </div>
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.detailSection}>
                <h3>Opis</h3>
                <div className={styles.detailContent}>
                  {user.description ? (
                    <p>{user.description}</p>
                  ) : (
                    <p className={styles.noData}>Nie dodano jeszcze opisu.</p>
                  )}
                </div>
              </div>

              {(user.instagramLink || user.linkedinLink || user.youtubeLink) && (
                <div className={styles.detailSection}>
                  <h3>Linki</h3>
                  <div className={styles.socialLinks}>
                    <ul>
                      {user.instagramLink && (
                        <li>
                          <a
                            href={user.instagramLink}
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-instagram"></i> Instagram
                          </a>
                        </li>
                      )}
                      {user.linkedinLink && (
                        <li>
                          <a
                            href={user.linkedinLink}
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-linkedin"></i> LinkedIn
                          </a>
                        </li>
                      )}
                      {user.youtubeLink && (
                        <li>
                          <a
                            href={user.youtubeLink}
                            className={styles.socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
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
      <Footer />
    </div>
  );
};

export default Profile;