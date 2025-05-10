import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';
import styles from '../../stylePage/styles.module.css';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Additional/Loading';

const CommunityMain = () => {
  const [loading, setLoading] = useState<boolean>(false);
    const { user, isAuthenticated, token } = useAuth();

    if (!isAuthenticated) {
      return (
        <div className="app-container dark-theme">
          <Header />
          <section className={styles.userSearchContainer}>
            <div className={styles.searchContent}>
              <p className={styles.errorMessage}>
                Musisz być zalogowany, aby przeglądać swoje organizacje.
              </p>
            </div>
          </section>
          <Footer />
        </div>
      );
    }

  return (
    <div className="app-container">
    <Header/>
      <section className={styles.container}>
    {loading ? (
        <Loading/>
      ) : (
        <div className={styles.content}>
        <h2 className={styles.title}>Centrum Społeczności</h2>
        
        <div className={styles.grid}>
          <Link to="/community/friends" className={styles.card}>
            <div className={styles.icon}>
              <i className="fas fa-users"></i>
            </div>
            <h3>Moi Znajomi</h3>
            <p>Zarządzaj swoją listą znajomych i połączeniami</p>
          </Link>
          
          <Link to="/community/organisations" className={styles.card}>
            <div className={styles.icon}>
              <i className="fas fa-sitemap"></i>
            </div>
            <h3>Moje Organizacje</h3>
            <p>Przeglądaj i zarządzaj swoimi organizacjami</p>
          </Link>
          
          <Link to="/community/users" className={styles.card}>
            <div className={styles.icon}>
              <i className="fas fa-user-friends"></i>
            </div>
            <h3>Przeglądaj Użytkowników</h3>
            <p>Odkrywaj i łącz się z innymi użytkownikami</p>
          </Link>
          
          <Link to="/community/organisations/search" className={styles.card}>
            <div className={styles.icon}>
              <i className="fas fa-search"></i>
            </div>
            <h3>Znajdź Organizacje</h3>
            <p>Wyszukaj organizacje, do których możesz dołączyć</p>
          </Link>
        </div>
      </div>
      )}
    </section>
    <Footer/>
      
    </div>
  );
};

export default CommunityMain;