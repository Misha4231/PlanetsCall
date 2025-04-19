import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { blockUserAdmin, getUsersAdmin, resetUserAdmin, unblockUserAdmin } from '../../services/adminService';
import { UserAdmin, UsersResponseAdmin } from '../../types/adminTypes';
import styles from '../../stylePage/admin/admin.module.css';
import { isBlock } from 'typescript';

const AdminUsers = () => {
    const { user, isAuthenticated, token } = useAuth();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<UserAdmin[]>([]);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
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



  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
      <Footer/>

    </div>);   
  }

  if(!user?.isAdmin){
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Nie masz uprawnień administratora.</p>
      <Footer/>

    </div>);  
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
          
          {loading ? (
            <p>Ładowanie...</p>
          ) : (
            <>
              {success && <div className={`${styles.adminMessage} ${styles.adminSuccess}`}>{success}</div>}
              {error && <div className={`${styles.adminMessage} ${styles.adminError}`}>{error}</div>}
                  <Link 
                    to={`/admin/`} 
                    className={styles.adminBackButton}
                  >
                    <i className="fas fa-arrow-left"></i> Powrót
                  </Link>
              
              {users.length > 0 ? (
                <ul className={styles.adminList}>
                  {users.map((us) => (
                    <li key={us.id} className={styles.adminListItem}>
                      <div className={styles.adminListItemContent}>
                        <Link 
                          to={`/user/${us.username}`} 
                          className={styles.adminListItemLink}
                        >
                          {us.username}
                        </Link>
                        {us.isBlocked && <span style={{color: '#f44336'}}>(Zablokowany)</span>}
                      </div>
                      <div className={styles.adminButtonGroup}>
                        {us.isBlocked ? (
                          <button
                            onClick={() => handleUnblockUser(us.username)}
                            disabled={loading}
                            className={`${styles.adminButton} ${styles.adminButtonPrimary}`}
                          >
                            <i className="fas fa-lock-open"></i> Odblokuj
                          </button>
                        ) : (
                          <button
                            onClick={() => openBlockConfirmation(us.username)}
                            disabled={loading}
                            className={`${styles.adminButton} ${styles.adminButtonDanger}`}
                          >
                            <i className="fas fa-lock"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleResetUser(us.username)}
                          disabled={loading}
                          className={`${styles.adminButton} ${styles.adminButtonWarning}`}
                        >
                          <i className="fas fa-key"></i> Resetuj hasło
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
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

