import React from 'react';
import styles from '../../stylePage/specialPages.module.css';

const Loading = () => {
    return (
        <section className={styles.specialContainer}>
            <div className={styles.loadingSpinner}></div>
        </section>
    );
};

export default Loading;