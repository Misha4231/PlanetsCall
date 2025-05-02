import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getItemsByCategory, getCategories, removeCategory, removeItems} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/admin/adminShop.module.css';
import Ecorus from '../../../components/Ecorus';

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  rarity: string;
  categoryId: number;
}

interface Category {
  id: number;
  title: string;
  image: string;
}

const AdminShopCategory = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (token && user?.isAdmin && id) {
      fetchData();
    }
  }, [token, user?.isAdmin, id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryId = parseInt(id!);
      
      const categories = await getCategories(token!);
      const foundCategory = categories.find((c: { id: number; }) => c.id === categoryId);
      if (!foundCategory) throw new Error('Kategoria nie znaleziona');
      setCategory(foundCategory);
      
      const itemsData = await getItemsByCategory(token!, categoryId);
      setItems(itemsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!token) return;
    
    try {
      setLoading(true);
      await removeItems(token, itemId);
      setSuccess('Przedmiot został usunięty pomyślnie');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!token || !category) return;
    
    try {
      setLoading(true);
      await removeCategory(token, category.id);
      setSuccess('Kategoria została usunięta pomyślnie');
      // Redirect after deletion
      window.location.href = '/admin/shop';
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

  if (!category) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="app-container">
      <Header />
      <section className={styles.adminContainer}>
      <div className={styles.adminContent}>
        <h1 className={styles.categoryPageTitle}>Zarządzanie kategorią: {category.title}</h1>
        <Link to="/admin/shop" className={styles.backButton}>
          <i className="fas fa-arrow-left"></i> Powrót do panelu sklepu
        </Link>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}
        {loading && (
          <p className={styles.loadingMessage}>
            <i className={`fas fa-spinner ${styles.loadingSpinner}`}></i> Ładowanie...
          </p>
        )}

        <div className={styles.categoryManagementContainer}>
          <div className={styles.categoryHeaderWrapper}>
            <div className={styles.categoryImageContainer}>
              <div className={styles.characterContainer}>
                <div className={styles.imageWrapper}>
                  <Ecorus className={styles.characterBody} />
                  <img 
                    src={imageUrl() + category.image} 
                    alt={category.title} 
                    className={styles.characterClothes}
                  />
                </div>
              </div>
            </div>
            <div className={styles.categoryActionsWrapper}>
              <Link 
                to={`/admin/shop/category/${category.id}/edit`}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                Edytuj kategorię
              </Link>
              <button 
                onClick={handleDeleteCategory}
                className={`${styles.actionButton} ${styles.deleteButton}`}
                disabled={loading}
              >
                Usuń kategorię
              </button>
            </div>
          </div>

          <div className={styles.itemsSection}>
            <div className={styles.sectionTitle}>
              <h2>Przedmioty w kategorii</h2>
              <Link 
                to={`/admin/shop/category/${id}/create-item/`}
                className={styles.primaryButton}
              >
                <i className="fas fa-plus"></i> Dodaj nowy przedmiot
              </Link>
            </div>

            <div className={styles.itemsGrid}>
              {items.length > 0 ? (
                items.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemPrice}>Cena: {item.price} zł</p>
                    <p className={styles.itemRarity}>Rzadkość: {item.rarity}</p>
                    <div className={styles.imageContainer}>
                      <div className={styles.characterContainer}>
                        <div className={styles.imageWrapper}>
                          <Ecorus className={styles.characterBody} />
                          <img 
                                src={imageUrl() + item.image} 
                            alt={category.title} 
                            className={styles.characterClothes}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <Link
                        to={`/admin/shop/category/${id}/item/${item.id}/edit`}
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        Edytuj
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        disabled={loading}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.statusMessage}>Brak itemów</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
      <Footer />
    </div>
  );
};

export default AdminShopCategory;