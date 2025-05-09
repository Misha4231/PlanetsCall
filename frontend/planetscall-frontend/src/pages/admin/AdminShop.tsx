import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCategories } from '../../services/shopService';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { convertImageToBase64, imageUrl } from '../../services/imageConvert';
import NotAdmin from '../Additional/NotAdmin';
import styles from '../../stylePage/admin/adminShop.module.css';
import Ecorus from '../../components/Ecorus';

interface Category {
  id: number;
  title: string;
  image: string;
}

const AdminShop: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (token && user?.isAdmin) {
      fetchCategories();
    }
  }, [token, user?.isAdmin]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(token!);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Header/>
        <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
        <Footer/>
      </div>
    );   
  }

  if(!user?.isAdmin) {
    return <NotAdmin/>;
  }

  return (
    <div className="app-container">
      <Header />
      <section className={styles.adminContainer}>
        <div className={styles.adminContent}>
          <h1 className={styles.categoryPageTitle}>Panel administracyjny sklepu</h1>
          <Link to="/admin/" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i> Powrót
          </Link>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {loading && <p className={styles.loadingMessage}>
            <i className={`fas fa-spinner ${styles.loadingSpinner}`}></i> Ładowanie...
          </p>}

          <div className={styles.categoryManagementContainer}>
            <div className={styles.itemsSection}>
              <div className={styles.sectionTitle}>
                <h2>Kategorie</h2>
                <Link 
                  to="/admin/shop/create-category" 
                  className={`${styles.primaryButton}`}
                >
                  <i className="fas fa-plus"></i> Dodaj nową kategorię
                </Link>
              </div>

              {categories.length === 0 ? (
                <p className={styles.statusMessage}>Nie ma jeszcze utworzonych kategorii</p>
              ) : (
                <div className={styles.itemsGrid}>
                  {categories.map(category => (
                    <div key={category.id} className={styles.itemCard}>
                      <div className={styles.categoryContainer}>
                        <img 
                          src={imageUrl() + category.image} 
                          alt={category.title} 
                          className={`${styles.categoryIcons}`}
                        />
                    </div>
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemTitle}>{category.title}</h3>
                      </div>
                      <div className={styles.itemActions}>
                        <Link 
                          to={`/admin/shop/category/${category.id}`}
                          className={` ${styles.actionButton} ${styles.editButton}`}
                        >
                          <i className="fas fa-cog"></i> Zarządzaj
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminShop;