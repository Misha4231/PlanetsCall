import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getItemsByCategory, getCategories, removeCategory, removeItems} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/styles.module.css';
import Ecorus from '../../../components/Ecorus';
import { RarityType } from '../../shop/Shop';
import NotAuthenticated from '../../Additional/NotAuthenticated';
import Loading from '../../Additional/Loading';

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  rarity: RarityType;
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
  const [selectedRarities, setSelectedRarities] = useState<RarityType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
    const navigate = useNavigate();

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
      setTimeout(() => navigate('/admin/shop'), 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRarityFilter = (rarity: RarityType) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };
  
  const filteredItems = selectedRarities.length === 0
  ? items
  : items.filter(item => selectedRarities.includes(item.rarity));



  if (!isAuthenticated) {
    return (
      <NotAuthenticated/>
    );   
  }

  if(!user?.isAdmin) {
    return <NotAdmin/>;
  }

  if (!category) {
    return <Loading/>;
  }

  return (
    <div className="app-container">
      <Header />
      <section className={styles.container}>
      <div className={styles.content}>
          <div className={styles.categoryHeaderWrapper}>
        <h1 className={styles.pageTitle}>Zarządzanie kategorią: {category.title}</h1>
            <div className={styles.categoryInfo}>
              <div className={styles.categoryImageContainer}>
                <div className={styles.categoryContainer}>
                    <img 
                      src={imageUrl() + category.image} 
                      alt={category.title} 
                      className={`${styles.categoryIcons}`}
                    />
              </div>
            </div>

            </div>
            <div className={styles.categoryActionsWrapper}>
              <Link 
                to={`/admin/shop/category/${category.id}/edit`}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                <i className="fas fa-edit"></i> Edytuj kategorię
              </Link>
              <button 
                onClick={handleDeleteCategory}
                className={`${styles.actionButton} ${styles.deleteButton}`}
                disabled={loading}
              >
                <i className="fas fa-trash"></i> Usuń kategorię
              </button>
            </div>
          </div>
          
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

          <div className={styles.itemsSection}>
            <div className={styles.sectionTitle}>
              <h2>Przedmioty kategorii</h2>
              <div className={styles.filterBar}>
                <span>Filtruj po rzadkości:</span>
                {(["Common", "Rare", "Epic", "Uncommon"] as RarityType[]).map(rarity => (
                  <button
                    key={rarity}
                    className={`${styles.filterButton} ${selectedRarities.includes(rarity) ? styles.active : ''}`}
                    onClick={() => toggleRarityFilter(rarity)}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
              <Link 
                to={`/admin/shop/category/${id}/create-item/`}
                className={styles.primaryButton}
              >
                <i className="fas fa-plus"></i> Dodaj nowy przedmiot
              </Link>
            </div>

            <div className={styles.itemsGrid}>
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemPrice}>Koszt: {item.price}</p>
                    <p className={styles.itemRarity}>Rzadkość: {item.rarity}</p>
                    <div className={styles.imageWrapper }>
                      <div className={styles.characterContainer}>
                        <div className={styles.imageWrapper}>
                          
                          
              
                {category.title == 'Hełmy' ? (
                   <Ecorus className={styles.characterBody} variant='hat' />

                ) : category.title == 'Kostiumy bez hełmów' ? (
                   <Ecorus className={styles.characterBody} variant='noHair' />

                ) : category.title == 'Kostiumy całe' ? (
                   <Ecorus className={styles.characterBody} variant='hat' />

                ) : (
                    <Ecorus className={styles.characterBody} />
                )}

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
                        <i className="fas fa-edit"></i> Edytuj
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        disabled={loading}
                      >
                        <i className="fas fa-trash"></i> Usuń
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