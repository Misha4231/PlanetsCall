import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCategories } from '../../services/shopService';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import { convertImageToBase64, imageUrl } from '../../services/imageConvert';
import NotAdmin from '../Additional/NotAdmin';
import styles from '../../stylePage/admin/admin.module.css';

interface Category {
  id: number;
  title: string;
  image: string;
}

const AdminShop = () => {
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
          <h1>Panel administracyjny sklepu</h1>
          <Link to="/admin/" className={styles.backLink}>Powrót do panelu admina</Link>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {loading && <p>Ładowanie...</p>}

          <div className={styles.section}>
            <h2>Kategorie</h2>
            <Link to="/admin/shop/create-category" className={styles.addButton}>
              Dodaj nową kategorię
            </Link>

            <div className={styles.grid}>
              {categories.map(category => (
                <div key={category.id} className={styles.card}>
                  <h3>{category.title}</h3>
                  <img src={imageUrl() + category.image} alt={category.title} className={styles.image} />
                  <div className={styles.actions}>
                    <Link 
                      to={`/admin/shop/category/${category.id}`} 
                      className={styles.actionButton}
                    >
                      Zarządzaj
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminShop;