import React from 'react';
import styles from '../../stylePage/specialPages.module.css';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';

const NotAdmin = () => {
    return (
        <div className="app-container dark-theme">
            <Header />
            <section className={styles.specialContainer}>
                <div className={`${styles.specialMessage} ${styles.adminWarning}`}>
                    <i className="fas fa-exclamation-triangle"></i> Tylko administrator może przeglądać tę sekcję.
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default NotAdmin;