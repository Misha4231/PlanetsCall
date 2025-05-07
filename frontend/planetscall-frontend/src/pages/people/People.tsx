import React, { useEffect, useState } from 'react'; 
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { imageUrl } from '../../services/imageConvert';
import { useAuth } from '../../context/AuthContext';
import { searchUsers, UserProfile, Users } from '../../services/peopleService';
import { getFriends } from '../../services/communityService';
import styles from '../../stylePage/community.module.css';
import Loading from '../Additional/Loading';
import NotAuthenticated from '../Additional/NotAuthenticated';

const People = () => {
    const { isAuthenticated, token, user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState<string>("");
    const [friendsStatus, setFriendsStatus] = useState<{[key: string]: boolean}>({});
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

    const checkIsFriend = async (username: string) => {
        if (!isAuthenticated || !token) return false;
        
        try {
            const response = await getFriends(token, 1, username);
            return response.length > 0 && response[0].username === username;
        } catch (err) {
            console.error("Error checking friend status:", err);
            return false;
        }
    };

    const updateFriendsStatus = async (users: UserProfile[]) => {
        const statusMap: {[key: string]: boolean} = {};
        
        for (const user of users) {
            statusMap[user.username] = await checkIsFriend(user.username);
        }
        
        setFriendsStatus(statusMap);
    };

    if (!isAuthenticated) {
        return (
            <NotAuthenticated/>
        );
    }

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isAuthenticated || !token) return;

        try {
            setLoading(true);
            const response: Users = await searchUsers(token, searchPhrase, pagination.pageIndex);
            setUsers(response.items);
            await updateFriendsStatus(response.items); 
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

    return (
        <div className="app-container dark-theme">
            <Header />
            <section className={styles.userSearchContainer}>
                {loading ? (
                        <Loading />
                ) : (
                    <div className={styles.searchContent}>
                        <h2 className={styles.searchTitle}>
                            Wyszukaj użytkowników
                        </h2>

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

                        {error && (
                            <div className={styles.errorMessage}>
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}

                        {users.length > 0 ? (
                            <>
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
                                                    <h3 className={`${styles.username} ${friendsStatus[user.username] ? styles.friendUsername : ''}`}>
                                                        {user.username}
                                                        {user.isAdmin && (
                                                            <span className={styles.adminBadge}>
                                                                <i className="fas fa-crown"></i> Admin
                                                            </span>
                                                        )}
                                                        {friendsStatus[user.username] && (
                                                            <span className={styles.friendBadge}>
                                                                <i className="fas fa-user-friends"></i> Znajomy
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

                                <div className={styles.pagination}>
                                    <button
                                        onClick={() => handlePageChange(pagination.pageIndex - 1)}
                                        disabled={!pagination.hasPreviousPage || loading}
                                        className={styles.paginationButton}
                                    >
                                        <i className="fas fa-chevron-left"></i> Poprzednia
                                    </button>
                                    <span className={styles.pageInfo}>
                                        Strona {pagination.pageIndex} z {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.pageIndex + 1)}
                                        disabled={!pagination.hasNextPage || loading}
                                        className={styles.paginationButton}
                                    >
                                        Następna <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
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
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
};

export default People;