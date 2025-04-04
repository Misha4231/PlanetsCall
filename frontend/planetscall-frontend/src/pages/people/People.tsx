import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import Footer from '../../components/Footer/Footer'
import { useNavigate } from 'react-router-dom';
import { imageUrl } from '../../services/imageConvert';
import { useAuth, User } from '../../context/AuthContext';
import { searchUsers, UserProfile, Users } from '../../services/peopleService';
import '../../stylePage/people.css';

const People = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
      pageIndex: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  
    useEffect(() => {
        if (pagination.pageIndex !== 1 && searchPhrase) {
          handleSearch();
        }
      }, [pagination.pageIndex]);

    if (!isAuthenticated) {
      return (
        <div className="app-container dark-theme">
          <Header/>
          <section className="blockCode people-container">
            <div className="people-content">
              <p className="auth-message">
                Musisz być zalogowany, aby przeglądać użytkowników.
              </p>
            </div>
          </section>
          <Footer/>
        </div>
      );   
    }
  
    const handleSearch = async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!isAuthenticated || !token) return;
  
      try {
        setLoading(true);
        const response: Users = await searchUsers(token, searchPhrase, pagination.pageIndex);
        setUsers(response.items);
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
      setPagination(prev => ({...prev, pageIndex: newPage}));
    };

  return (
    <div className="app-container dark-theme">
        <Header/>
        <section className="blockCode people-container-wide">
            
        {loading ? (
        <span className="button-loader"></span>
        ) : (
        <div className="people-content">
            <h2 className="people-title">
            Wyszukaj użytkowników
            </h2>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-group">
              <label htmlFor="search" className="search-label">WYSZUKAJ</label>
              <div className="search-input-wrapper">
                <input
                  id="search"
                  type="text"
                  value={searchPhrase}
                  onChange={(e) => setSearchPhrase(e.target.value)}
                  placeholder="Wpisz nazwę użytkownika lub email..."
                  className="search-input"
                />
                <button 
                  type="submit" 
                  className="search-button"
                  disabled={!searchPhrase.trim()}
                >
                    <span>Szukaj</span>
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

                {users.length > 0 ? (
                    <div className="search-results">
                    <div className="users-horizontal-list">
                        {users.map((user) => (
                        <div key={user.id} className="user-card-horizontal" onClick={() => navigate(`/user/${user.username}`)}>
                            <div className="user-avatar-circle">
                            {user.profileImage ? (                        
                                <img 
                                src={imageUrl() + user.profileImage} 
                                alt={`Profilowe ${user.username}`}
                                className="avatar-img"
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                <i className="fas fa-user"></i>
                                </div>
                            )}
                            </div>
                            <div className="user-info-main">
                            <div className="username-wrapper">
                                <h3 className="user-username">
                                {user.username}
                                {user.isAdmin && <span className="admin-badge"><i className="fas fa-crown"></i> Admin</span>}
                                </h3>
                                {user.isBlocked && (
                                <span className="user-status blocked">
                                    <i className="fas fa-lock"></i> Zablokowany
                                </span>
                                )}
                            </div>
                            </div>
                            <div className="user-stats-horizontal">
                            <div className="stat-item">
                                <span className="stat-label">Punkty:</span>
                                <span className="stat-value">{user.points}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Postęp:</span>
                                <div className="progress-bar-container">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: `${user.progress}%` }}
                                ></div>
                                <span className="progress-text">{user.progress}%</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>

              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(pagination.pageIndex - 1)}
                  disabled={!pagination.hasPreviousPage || loading}
                  className="pagination-button prev"
                >
                  <i className="fas fa-chevron-left"></i> Poprzednia
                </button>
                <span className="page-info">
                  Strona {pagination.pageIndex} z {pagination.totalPages}
                </span>
                <button 
                  onClick={() => handlePageChange(pagination.pageIndex + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="pagination-button next"
                >
                  Następna <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          ) : searchPhrase ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>Nie znaleziono użytkowników pasujących do wyszukiwania "{searchPhrase}"</p>
            </div>
          ) : (
            <div className="no-results">
              <p>Wpisz frazę, by znaleźć użytkownika</p>
            </div>
          )}
        </div>
        )}
      </section>
      <Footer/>
    </div>
  )
}

export default People;