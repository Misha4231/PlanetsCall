import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getItemsByCategory, getCategories, removeCategory, removeItems} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/admin/adminShop.module.css';

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
          <h1>Zarządzanie kategorią: {category.title}</h1>
          <Link to="/admin/shop" className={styles.backLink}>Powrót do sklepu</Link>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
          {loading && <p>Ładowanie...</p>}

          <div className={styles.section}>
            <div className={styles.categoryHeader}>
              <div>
                <img src={imageUrl() + category.image} alt={category.title} className={styles.image} />
              </div>
              <div className={styles.categoryActions}>
                <Link 
                  to={`/admin/shop/category/${category.id}/edit`}
                  className={styles.editButton}
                >
                  Edytuj kategorię
                </Link>
                <button 
                  onClick={handleDeleteCategory}
                  className={styles.deleteButton}
                  disabled={loading}
                >
                  Usuń kategorię
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <h2>Przedmioty w kategorii</h2>
              <Link 
                to={`/admin/shop/category/${id}/create-item/`}
                className={styles.addButton}
              >
                Dodaj nowy przedmiot
              </Link>

              <div className={styles.grid}>
                {items.length > 0 ? (
                  <>
                    {items.map(item => (
                    <div key={item.id} className={styles.card}>
                      <h3>{item.title}</h3>
                      <p>Cena: {item.price} zł</p>
                      <p>Rzadkość: {item.rarity}</p>
                      <img src={imageUrl() + item.image} alt={item.title} className={styles.image} />
                      <div className={styles.actions}>
                        <Link
                          to={`/admin/shop/category/${id}/item/${item.id}/edit`}
                          className={styles.actionButton}
                        >
                          Edytuj
                        </Link>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className={styles.deleteButton}
                          disabled={loading}
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                  ))}
                  </>
                )  : (
                  <>
                    <p>Brak itemów</p>
                  </>
                )
              }
                
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