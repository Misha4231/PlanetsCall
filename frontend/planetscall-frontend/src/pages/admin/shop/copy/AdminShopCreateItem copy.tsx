import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { getCategories, addItems} from '../../../../services/shopService';
import Header from '../../../../components/shared/Header';
import Footer from '../../../../components/Footer/Footer';
import NotAdmin from '../../../Additional/NotAdmin';
import styles from '../../../stylePage/admin/adminShop.module.css';


interface Category {
  id: number;
  title: string;
}

const AdminShopCreateItem = () => {
  const { user, isAuthenticated, token } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultCategoryId = queryParams.get('categoryId') || '0';
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    image: '',
    rarity: '',
    categoryId: parseInt(defaultCategoryId)
  });
  const navigate = useNavigate();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'categoryId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setLoading(true);
      await addItems(token, formData);
      setSuccess('Przedmiot został dodany pomyślnie');
      setTimeout(() => navigate(`/admin/shop/category/${formData.categoryId}`), 1000);
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
          <h1>Dodaj nowy przedmiot</h1>
          <Link 
            to={formData.categoryId ? `/admin/shop/category/${formData.categoryId}` : '/admin/shop'} 
            className={styles.backLink}
          >
            Powrót
          </Link>

          {error && <p className={styles.errorMessage}>{error}</p>}
          {success && <p className={styles.successMessage}>{success}</p>}
          {loading && <p>Ładowanie...</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tytuł:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cena:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Obraz (URL):</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Rzadkość:</label>
              <input
                type="text"
                name="rarity"
                value={formData.rarity}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Kategoria:</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value="0">Wybierz kategorię</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              Dodaj przedmiot
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminShopCreateItem;