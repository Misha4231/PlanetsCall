import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getItemsByCategory, getCategories, updateItem} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/admin/adminShop.module.css';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';

interface Category {
  id: number;
  title: string;
}

const AdminShopEditItem = () => {
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
      title: '',
      price: 0,
      image: '',
      rarity: '',
      categoryId: 0
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isNewImage, setIsNewImage] = useState<boolean>(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (token && user?.isAdmin && id) {
        fetchData();
      }
    }, [token, user?.isAdmin, id]);
  
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const categoriesData = await getCategories(token!);
        setCategories(categoriesData);
        
        for (const category of categoriesData) {
          const items = await getItemsByCategory(token!, category.id);
          const foundItem = items.find((i: { id: number; }) => i.id === parseInt(id!));
          if (foundItem) {
            setFormData({
              title: foundItem.title,
              price: foundItem.price,
              image: foundItem.image,
              rarity: foundItem.rarity,
              categoryId: foundItem.categoryId
            });
            
            setPreviewImage(imageUrl() + foundItem.image);
            setIsNewImage(false);
            break;
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      try {
        const base64Image = await convertImageToBase64(file);
        setFormData(prev => ({ ...prev, image: base64Image }));
        setPreviewImage(base64Image);
        setIsNewImage(true);
      } catch (error) {
        console.error('Error converting image:', error);
        setError('Wystąpił błąd podczas przetwarzania zdjęcia');
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
      if (!token || !id) return;
      
      try {
        setLoading(true);
        await updateItem(
          token,
          parseInt(id),
          formData.categoryId,
          formData.price,
          formData.image,
          formData.rarity,
          formData.title
        );
        setSuccess('Przedmiot został zaktualizowany pomyślnie');
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
            <h1>Edytuj przedmiot</h1>
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
                <label className={styles.formLabel}>Obraz:</label>
                <div className={styles.imageUploadContainer}>
                  {previewImage && (
                    <div className={styles.imagePreview}>
                      <img 
                        src={previewImage} 
                        alt="Podgląd obrazu przedmiotu" 
                        className={styles.previewImage}
                      />
                    </div>
                  )}
                  <label className={styles.fileInputLabel}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={styles.fileInput}
                    />
                    <span className={styles.fileInputButton}>Wybierz nowy obraz</span>
                  </label>
                  {!isNewImage && previewImage && (
                    <p className={styles.imageNote}>Obecny obraz pozostanie niezmieniony</p>
                  )}
                </div>
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
                Zapisz zmiany
              </button>
            </form>
          </div>
        </section>
        <Footer />
      </div>
    );
  };
  
  export default AdminShopEditItem;