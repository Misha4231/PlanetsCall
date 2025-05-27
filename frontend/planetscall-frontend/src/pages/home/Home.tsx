import React from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';
import styles from '../../stylePage/mainMenu.module.css'
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();

  return (
    <div className="app-container">
      <Header/>
      <section className="blockCode">
        <div className={styles.heroContainer}>
          <img
            src={require('../../assets/planetsCall.jpg')}
            alt="Planet's Call"
            className={styles.heroImage}
          />
          <div className={styles.overlay}>
            <h1 className={styles.title}>Planet's Call</h1>
            <p className={styles.subtitle}>
              Wykonuj zadania, dostawaj itemy, bądź eko!
            </p>
            {isAuthenticated ? (
              <button className={styles.startButton}><Link to="/profile" className={styles.startLink}>Zacznij</Link></button>
            ): (              
              <button className={styles.startButton}><Link to="/auth/sign-up" className={styles.startLink}>Zacznij</Link></button>
            )}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
