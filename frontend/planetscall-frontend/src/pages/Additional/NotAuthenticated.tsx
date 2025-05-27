import React from 'react';
import styles from '../../stylePage/specialPages.module.css';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';

const NotAuthenticated = () => {
    return (
        <div className="app-container dark-theme">
            <Header />
            <section className={styles.specialContainer}>
                <div className={styles.specialMessage}>
                    Musisz być zalogowany, aby przeglądać tę stronę.
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default NotAuthenticated;