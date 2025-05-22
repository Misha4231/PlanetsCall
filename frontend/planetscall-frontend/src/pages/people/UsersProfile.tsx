import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth, User } from '../../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Ecorus from '../../components/Ecorus';
import { imageUrl } from '../../services/imageConvert';
import { getAddAttendance, getAnotherUser, getUserSelectedItems } from '../../services/userService';
import { getFriends, addFriend, removeFriend } from '../../services/communityService';
import { getCategories, Items } from '../../services/shopService';
import styles from '../../stylePage/profile.module.css';
import Loading from '../Additional/Loading';

interface Category {
  id: number;
  title: string;
  image: string;
}

const UsersProfile = () => {
  const { userName } = useParams<{ userName: string }>();
  const { user, isAuthenticated, token } = useAuth();
  const [anotherUser, setAnotherUser] = useState<User>();
  const [friends, setFriends] = useState<any[]>([]);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Items[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{success: boolean, message: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username === userName) {
      navigate('/profile/');
    }
  }, [user, userName, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userName || !token || !user?.id) return;
      try {
        setLoading(true);
        const userData = await getAnotherUser(token, userName);
        setAnotherUser(userData);
        console.log(userData.id);

        const friendsData = await getFriends(token, 1, '');
        setIsFriend((friendsData as { username: string }[]).some(f => f.username === userName));

        const categoriesData = await getCategories(token);
        setCategories(categoriesData);

        const allItems: Items[] = [];
        for (const category of categoriesData) {
          const response = await getUserSelectedItems(token, userData.id, category.id, userData.id);
          allItems.push(...response.items);
        }
        setSelectedItems(allItems);

      } catch (err: any) {
        console.error('Error fetching user profile:', err.message);
        setError('Błąd ładowania profilu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userName, token]);

  const handleAddFriend = async () => {
    if (!token || !anotherUser) return;
    try {
      setLoadingForm(true);
      await addFriend(token, anotherUser.username);
      setIsFriend(true);
      setServerStatus({success: true, message: 'Znajomy został dodany!'});
      setTimeout(() => setServerStatus(null), 3000);
    } catch (err: any) {
      const message = err.message;
      setServerStatus({success: false, message});
      setTimeout(() => setServerStatus(null), 3000);
    } finally {
      setLoadingForm(false);
    }
  };


  const handleRemoveFriend = async () => {
    if (!token || !anotherUser) return;
    try {
      setLoadingForm(true);
      await removeFriend(token, anotherUser.username);
      setIsFriend(false);
      setServerStatus({success: true, message: 'Znajomy został usunięty!'});
      setTimeout(() => setServerStatus(null), 3000);
    } catch (err: any) {
      const message = err.message;
      setServerStatus({success: false, message});
      setTimeout(() => setServerStatus(null), 3000);
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.profileContainer}>
        {loading || !anotherUser ? (
          <Loading />
        ) : (
          <div className={styles.profileContent}>
            <div className={styles.profileHeader}>
              <div className={styles.profileAvatar}>
                {anotherUser.profileImage ? (
                  <img
                    src={imageUrl() + anotherUser.profileImage}
                    className={styles.avatarImage}
                    alt="avatar"
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <i className="fas fa-user"></i>
                  </div>
                )}
                
                    <div className={styles.avatarControls}>
                      {isAuthenticated && (
                        !isFriend ? (
                          <button onClick={handleAddFriend} disabled={loadingForm} className={styles.primaryButton}>
                            
                          {loadingForm ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i> Dodawanie...
                            </>
                            ) : (
                            <>
                           <i className="fas fa-plus"></i>  Dodaj do znajomych
                            </>
                            )}
                          </button>
                        ) : (
                          <button onClick={handleRemoveFriend}  disabled={loadingForm} className={`${styles.primaryButton} ${styles.deleteButton}`}>
                            
                          {loadingForm ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i> Usuwanie...
                            </>
                            ) : (
                            <>
                            <i className="fas fa-trash"></i> Usuń znajomego
                            </>
                            )}
                          </button>
                        )
                      )}
                      <Link to={`/profile/${anotherUser.username}/statistics`}>
                        <button className={`${styles.editButton} ${styles.smallerButton} ${styles.statystyka}`}>Statystyka</button>
                      </Link>
                    </div>
              </div>

              <div className={styles.flexMeBlock}>
                <section className={styles.userData}>
                  <div className={styles.profileInfo}>
                    <div className={styles.usernameSection}>
                      <h2>{anotherUser.username}</h2>
                      {anotherUser.isAdmin && (
                        <span className={styles.adminBadge}>
                          <i className="fas fa-crown"></i>Admin
                        </span>
                      )}
                    </div>

                    {(anotherUser.firstName || anotherUser.lastName) && (
                      <p className={styles.userName}>
                        {anotherUser.firstName} {anotherUser.lastName}
                      </p>
                    )}

                    <div className={styles.quickStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Punkty:</span>
                        <span className={styles.statValue}>{anotherUser.points}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Postęp:</span>
                        <span className={styles.statValue}>{anotherUser.progress} Level</span>
                      </div>
                    </div>

                  </div>
                </section>

                <div className={styles.ecorusContent}>
                  <div className={styles.profileImageWrapper}>                               
                          {(() => {
                            const helmetCategory = categories.find(c => c.title === 'Hełmy');
                            const costumeCategory = categories.find(c => c.title === 'Kostiumy całe');
                            const costumeWHelmetCategory = categories.find(c => c.title === 'Kostiumy bez hełmów');

                            const hasHelmet = helmetCategory && selectedItems.some(item => item.categoryId === helmetCategory.id);
                            const hasCostume = costumeCategory && selectedItems.some(item => item.categoryId === costumeCategory.id);
                            const hasCostumeWHelmet = costumeWHelmetCategory && selectedItems.some(item => item.categoryId === costumeWHelmetCategory.id);

                            if (hasHelmet || hasCostume) {
                              return <Ecorus className={styles.profileEcorusImage} variant="hat" />;
                            } else if (hasCostumeWHelmet) {
                              return <Ecorus className={styles.profileEcorusImage} variant="noHair" />;
                            } else {
                              return <Ecorus className={styles.profileEcorusImage} />;
                            }

                          })()}
                    {selectedItems.map((item) => (
                      <div key={item.id}>
                        <img
                          src={imageUrl() + item.image}
                          alt={item.title}
                          className={styles.profileCharacterClothes}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.profileDetails}>
              <div className={styles.detailSection}>
                <h3>Opis</h3>
                <div className={styles.detailContent}>
                  {anotherUser.description ? (
                    <p>{anotherUser.description}</p>
                  ) : (
                    <p className={styles.noData}>Brak opisu</p>
                  )}
                </div>
              </div>

              {(anotherUser.instagramLink || anotherUser.linkedinLink || anotherUser.youtubeLink) && (
                <div className={styles.detailSection}>
                  <h3>Linki</h3>
                  <div className={styles.socialLinks}>
                    <ul>
                      {anotherUser.instagramLink && (
                        <li>
                          <a href={anotherUser.instagramLink} target="_blank" rel="noopener noreferrer" className={`${styles.hiddenLinkUser} ${styles.Instagram}`}>
                            <i className="fab fa-instagram"></i> Instagram
                          </a>
                        </li>
                      )}
                      {anotherUser.linkedinLink && (
                        <li>
                          <a href={anotherUser.linkedinLink} target="_blank" rel="noopener noreferrer" className={`${styles.hiddenLinkUser} ${styles.LinkedIn}`}>
                            <i className="fab fa-linkedin"></i> LinkedIn
                          </a>
                        </li>
                      )}
                      {anotherUser.youtubeLink && (
                        <li>
                          <a href={anotherUser.youtubeLink} target="_blank" rel="noopener noreferrer" className={`${styles.hiddenLinkUser} ${styles.YouTube}`}>
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
      {serverStatus && (
        <div className={`${styles.notification} ${serverStatus.success ? styles.successNotification : styles.errorNotification}`}>
          {serverStatus.message}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UsersProfile;
