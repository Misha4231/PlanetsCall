import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Friend } from "../community/communityTypes";
import { getFriends, removeFriend } from '../../services/communityService';
import Footer from '../../components/Footer/Footer';
import { imageUrl } from '../../services/imageConvert';
import styles from '../../stylePage/community.module.css';
import Loading from '../Additional/Loading';

const Friends = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !token) return;
        fetchFriends();
    }, [isAuthenticated, token, search]);

    const fetchFriends = async () => {
        if (!isAuthenticated || !token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getFriends(token, 1, '');
            const filtered = search 
            ? data.filter((friend: { username: string; firstName: string; lastName: string; }) => 
                friend.username.toLowerCase().includes(search.toLowerCase()) ||
                (friend.firstName && friend.firstName.toLowerCase().includes(search.toLowerCase())) ||
                (friend.lastName && friend.lastName.toLowerCase().includes(search.toLowerCase()))): data;
            setFriends(filtered);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async (username: string) => {
        if (!isAuthenticated || !token) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await removeFriend(token, username);
            setSuccess('Znajomy został usunięty pomyślnie.');
            fetchFriends();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="app-container dark-theme">
                <Header />
                <section className="blockCode people-container">
                    <div className="people-content">
                        <p className="auth-message">
                            Musisz być zalogowany, aby przeglądać znajomych.
                        </p>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container dark-theme">
            <Header />
            <section className={styles.userSearchContainer}>
                <div className={styles.searchContent}>
                    <h2 className={styles.searchTitle}>
                        Twoi Znajomi ({friends.length})
                    </h2>

                    <div className={styles.searchGroup}>
                        <label htmlFor="friendSearch" className={styles.searchLabel}>WYSZUKAJ ZNAJOMYCH</label>
                        <div className={styles.searchInputWrapper}>
                            <input
                                id="friendSearch"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Wpisz nazwę znajomego..."
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    {success && (
                        <div className={styles.successMessage}>
                            <i className="fas fa-check-circle"></i> {success}
                        </div>
                    )}

                    {loading ? (
                        <Loading />
                    ) : friends.length > 0 ? (
                        <div className={styles.usersList}>
                            {friends.map((friend) => (
                                <div key={friend.username} className={styles.userCard}>
                                    <div 
                                        className={styles.avatarContainer}
                                        onClick={() => navigate(`/user/${friend.username}`)}
                                    >
                                        {friend.profileImage ? (
                                            <img
                                                src={imageUrl() + friend.profileImage}
                                                alt={`Profilowe ${friend.username}`}
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
                                            <h3 
                                                className={styles.username}
                                                onClick={() => navigate(`/user/${friend.username}`)}
                                            >
                                                {friend.username}
                                            </h3>
                                            {(friend.firstName || friend.lastName) && (
                                                <p className={styles.fullName}>
                                                    {friend.firstName} {friend.lastName}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFriend(friend.username)}
                                            className={styles.removeButton}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-user-minus"></i> Usuń
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : search ? (
                        <div className={styles.noResults}>
                            <i className="fas fa-search"></i>
                            <p>Nie znaleziono znajomych pasujących do wyszukiwania "{search}"</p>
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <i className="fas fa-users"></i>
                            <p>Nie masz jeszcze żadnych znajomych</p>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Friends;