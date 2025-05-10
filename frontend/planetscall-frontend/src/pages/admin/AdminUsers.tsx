import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { blockUserAdmin, getUsersAdmin, resetUserAdmin, unblockUserAdmin } from '../../services/adminService';
import { UserAdmin, UsersResponseAdmin } from '../../types/adminTypes';
import { searchUsers, UserProfile, Users } from '../../services/peopleService';
import styles from '../../stylePage/admin/adminUser.module.css';
import { isBlock } from 'typescript';
import NotAdmin from '../Additional/NotAdmin';
import { imageUrl } from '../../services/imageConvert';

const AdminUsers = () => {
    const { user, isAuthenticated, token } = useAuth();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [usersSearch, setUsersSearch] = useState<UserProfile[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'allUsers' | 'searchUser'>('allUsers');
    const [pagination, setPagination] = useState({
        pageIndex: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      totalPages: 1,
    });
    const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const navigate = useNavigate();

useEffect(() => {
  if (token && user?.isAdmin) {
        const fetchData = async () => {  
            try {
                setLoading(true);
                const userData: UsersResponseAdmin = await getUsersAdmin(token, page);
                setUsers(userData.items);
                setPagination({
                pageIndex: userData.pageIndex,
                hasNextPage: userData.hasNextPage,
                hasPreviousPage: userData.hasPreviousPage,
                totalPages: userData.totalPages,
              });
              setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        }    
    }, [token, page, user?.isAdmin]);


    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isAuthenticated || !token) return;

        try {
            setLoading(true);
            const response: Users = await searchUsers(token, searchPhrase, pagination.pageIndex);
            setUsersSearch(response.items);
            setPagination({
                pageIndex: response.pageIndex,
                totalPages: response.totalPages,
                hasPreviousPage: response.hasPreviousPage,
                hasNextPage: response.hasNextPage,
            });
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Wystąpił błąd podczas wyszukiwania');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, pageIndex: newPage }));
    };


    
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
      <Footer/>

    </div>);   
  }

  if(!user?.isAdmin){
    return (<NotAdmin/>) 
  } 


  const handleBlockUser = async (username: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await blockUserAdmin(token, username);
      setSuccess(`Użytkownik ${username} został zablokowany.`);
      refreshUserList();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowBlockConfirmation(false);
      setSelectedUser(null);
    }
  };



  const handleUnblockUser = async (username: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await unblockUserAdmin(token, username);
      setSuccess(`Użytkownik ${username} został odblokowany.`);
      refreshUserList();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetUser = async (username: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await resetUserAdmin(token, username);
      setSuccess(`Użytkownik ${username} został zresetowany.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserList = async () => {
    if (token) {
      try {
        const userData: UsersResponseAdmin = await getUsersAdmin(token, page);
        setUsers(userData.items);
      } catch (err: any) {
        setError(err.message || 'Wystąpił błąd podczas odświeżania listy.');
      }
    }
  };

  const openBlockConfirmation = (username: string) => {
    setSelectedUser(username);
    setShowBlockConfirmation(true);
};

  return (
    <div className="app-container dark-theme">
      <Header />
      <section className={styles.adminContainer}>
        <div className={styles.adminContent}>
          <h1 className={styles.adminTitle}>Zarządzanie użytkownikami</h1>
                      <Link 
                    to={`/admin/`} 
                    className={styles.adminBackButton}
                  >
                    <i className="fas fa-arrow-left"></i> Powrót
                  </Link>
        
        <div className={styles.taskTabs}>
          <button 
            className={`${styles.taskTab} ${activeTab === 'allUsers' ? 'active' : ''}`}
            onClick={() => setActiveTab('allUsers')}
          >
            <i className="fas fa-tasks"></i> Wszyscy użytkownicy
          </button>
          <button 
            className={`${styles.taskTab} ${activeTab === 'searchUser' ? 'active' : ''}`}
            onClick={() => setActiveTab('searchUser')}
          >
            <i className="fas fa-check-circle"></i> Wyszukiwarka
          </button>
        </div>

          {success && <div className={`${styles.adminMessage} ${styles.adminSuccess}`}>{success}</div>}
          {error && <div className={`${styles.adminMessage} ${styles.adminError}`}>{error}</div>}
                
        {loading ? (
          <p>Ładowanie...</p>
        ) : activeTab == 'allUsers' ? (
          <>
          
              {users.length > 0 ? (
                <div className={styles.usersList}>
                    {users.map((user) => (
                        <div key={user.id} className={styles.userCard} onClick={() => navigate(`/user/${user.username}`)}>
                            <div className={styles.avatarContainer}>
                                {user.profileImage ? (
                                    <img
                                        src={imageUrl() + user.profileImage}
                                        alt={`Profilowe ${user.username}`}
                                        className={styles.avatarImage}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <i className="fas fa-user"></i>
                                    </div>
                                )}
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.nameSection}>
                                    <h3 className={styles.username}>
                                        {user.username}
                                        {user.isAdmin && (
                                            <span className={styles.adminBadge}>
                                                <i className="fas fa-crown"></i> Admin
                                            </span>
                                        )}
                                    </h3>
                                    {(user.firstName || user.lastName) && (
                                        <p className={styles.fullName}>
                                            {user.firstName} {user.lastName}
                                        </p>
                                    )}
                                    {user.isBlocked && (
                                        <span className={styles.blockedStatus}>
                                            <i className="fas fa-lock"></i> Zablokowany
                                        </span>
                                    )}
                                </div>
                                <div className={styles.adminButtonGroup}>
                                    {user.isBlocked ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUnblockUser(user.username);
                                        }}
                                        disabled={loading}
                                        className={`${styles.adminButton} ${styles.adminButtonPrimary}`}
                                      >
                                        <i className="fas fa-lock-open"></i> Odblokuj
                                      </button>
                                    ) : (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openBlockConfirmation(user.username);
                                        }}
                                        disabled={loading}
                                        className={`${styles.adminButton} ${styles.adminButtonDanger}`}
                                      >
                                        <i className="fas fa-lock"></i>
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleResetUser(user.username);
                                      }}
                                      disabled={loading}
                                      className={`${styles.adminButton} ${styles.adminButtonWarning}`}
                                    >
                                      <i className="fas fa-key"></i> Resetuj
                                    </button>
                                  </div>
                                <div className={styles.progressSection}>
                                    <div className={styles.pointsBadge}>
                                        <span className={styles.progressText}><i className="fas fa-star"></i>  {user.progress} Level</span>
                                    </div>
                                    <div className={styles.pointsBadge}>
                                        <i className="fas fa-star"></i> {user.points} pkt
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    ))}
                </div>
              ) : (
                <div className={styles.adminEmpty}>
                  <i className="fas fa-user-slash"></i>
                  <p>Brak użytkowników.</p>
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div className={styles.adminPagination}>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={loading || !pagination.hasPreviousPage}
                    className={styles.adminPaginationButton}
                  >
                    <i className="fas fa-chevron-left"></i> Poprzednia
                  </button>
                  
                  <span className={styles.adminPaginationInfo}>
                    Strona {page} z {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={loading || !pagination.hasNextPage}
                    className={styles.adminPaginationButton}
                  >
                    Następna <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              
              <form onSubmit={handleSearch} className={styles.searchForm}>
                  <div className={styles.searchGroup}>
                      <label htmlFor="search" className={styles.searchLabel}>WYSZUKAJ</label>
                      <div className={styles.searchInputWrapper}>
                          <input
                              id="search"
                              type="text"
                              value={searchPhrase}
                              onChange={(e) => setSearchPhrase(e.target.value)}
                              placeholder="Wpisz nazwę użytkownika lub email..."
                              className={styles.searchInput}
                          />
                          <button
                              type="submit"
                              className={styles.searchButton}
                              disabled={!searchPhrase.trim() || loading}
                          >
                              {loading ? (
                                  <span className={styles.smallLoader}></span>
                              ) : (
                                  <span>Szukaj</span>
                              )}
                          </button>
                      </div>
                  </div>
              </form>
              {usersSearch.length > 0 ? (
                            <>
                                <div className={styles.usersList}>
                                    {usersSearch.map((user) => (
                                        <div key={user.id} className={styles.userCard} onClick={() => navigate(`/user/${user.username}`)}>
                                            <div className={styles.avatarContainer}>
                                                {user.profileImage ? (
                                                    <img
                                                        src={imageUrl() + user.profileImage}
                                                        alt={`Profilowe ${user.username}`}
                                                        className={styles.avatarImage}
                                                    />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        <i className="fas fa-user"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.userInfo}>
                                                <div className={styles.nameSection}>
                                                    <h3 className={styles.username}>
                                                        {user.username}
                                                        {user.isAdmin && (
                                                            <span className={styles.adminBadge}>
                                                                <i className="fas fa-crown"></i> Admin
                                                            </span>
                                                        )}
                                                    </h3>
                                                    {(user.firstName || user.lastName) && (
                                                        <p className={styles.fullName}>
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                    )}
                                                    {user.isBlocked && (
                                                        <span className={styles.blockedStatus}>
                                                            <i className="fas fa-lock"></i> Zablokowany
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={styles.adminButtonGroup}>
                                                    {user.isBlocked ? (
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleUnblockUser(user.username);
                                                        }}
                                                        disabled={loading}
                                                        className={`${styles.adminButton} ${styles.adminButtonPrimary}`}
                                                      >
                                                        <i className="fas fa-lock-open"></i> Odblokuj
                                                      </button>
                                                    ) : (
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          openBlockConfirmation(user.username);
                                                        }}
                                                        disabled={loading}
                                                        className={`${styles.adminButton} ${styles.adminButtonDanger}`}
                                                      >
                                                        <i className="fas fa-lock"></i>
                                                      </button>
                                                    )}
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleResetUser(user.username);
                                                      }}
                                                      disabled={loading}
                                                      className={`${styles.adminButton} ${styles.adminButtonWarning}`}
                                                    >
                                                      <i className="fas fa-key"></i> Resetuj hasło
                                                    </button>
                                                  </div>
                                                <div className={styles.progressSection}>
                                                    <div className={styles.pointsBadge}>
                                                        <span className={styles.progressText}><i className="fas fa-star"></i>  {user.progress} Level</span>
                                                    </div>
                                                    <div className={styles.pointsBadge}>
                                                        <i className="fas fa-star"></i> {user.points} pkt
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>
                                    ))}
                                </div>
                                    {pagination.totalPages > 1 && (
                                        <div className={styles.adminPagination}>
                                          <button
                                              onClick={() => handlePageChange(pagination.pageIndex - 1)}
                                              disabled={!pagination.hasPreviousPage || loading}
                                            className={styles.adminPaginationButton}
                                          >
                                            <i className="fas fa-chevron-left"></i> Poprzednia
                                          </button>
                                          
                                          <span className={styles.adminPaginationInfo}>
                                            Strona {page} z {pagination.totalPages}
                                          </span>
                                          
                                          <button
                                            onClick={() => handlePageChange(pagination.pageIndex + 1)}
                                            disabled={!pagination.hasNextPage || loading}
                                            className={styles.adminPaginationButton}
                                          >
                                            Następna <i className="fas fa-chevron-right"></i>
                                          </button>
                                        </div>
                                      )}
                            </>
                        ) : searchPhrase ? (
                            <div className={styles.noResults}>
                                <i className="fas fa-search"></i>
                                <p>Nie znaleziono użytkowników pasujących do wyszukiwania "{searchPhrase}"</p>
                            </div>
                        ) : (
                            <div className={styles.noResults}>
                                <i className="fas fa-users"></i>
                                <p>Wpisz frazę, by znaleźć użytkownika</p>
                            </div>
                        )}
            </>
          )}
        </div>
      </section>
      {showBlockConfirmation && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2 className={styles.modalTitle}>Potwierdzenie blokady</h2>
                        <p>Czy na pewno chcesz zablokować użytkownika {selectedUser}? Użytkownik nie będzie mógł się zalogować.</p>
                        <div className={styles.modalButtons}>
                            <button
                                className={`${styles.adminButton} ${styles.modalCancelButton}`}
                                onClick={() => setShowBlockConfirmation(false)}
                            >
                                Anuluj
                            </button>
                            <button
                                className={`${styles.adminButton} ${styles.adminButtonDanger}`}
                                onClick={() => selectedUser && handleBlockUser(selectedUser)}
                                disabled={loading}
                            >
                                {loading ? 'Blokowanie...' : 'Zablokuj użytkownika'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
      <Footer />
    </div>
  );
};

export default AdminUsers

