import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getItemsByCategory, getCategories, updateItem} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import Loading from '../../Additional/Loading';

interface Category {
  id: number;
  title: string;
}
interface ItemShop {    
  "categoryId": number,
  "price": number,
  "image": string,
  "rarity": RarityType,
  "title": string
}

type RarityType = "Common" | "Rare" | "Epic" | "Uncommon";

const AdminShopEditItem = () => {
  const {categoryIdParm, itemId} = useParams();
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<ItemShop>({
      categoryId: categoryIdParm ? parseInt(categoryIdParm) : 0,
      price: 0,
      image: '',
      "rarity": "Common" as RarityType,
      title: ''
    });
    console.log(categoryIdParm);
    console.log(itemId);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isNewImage, setIsNewImage] = useState<boolean>(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (token && user?.isAdmin &&  itemId && categoryIdParm) {
        fetchData();
      }
    }, [token, user?.isAdmin, itemId, categoryIdParm]);
  
    const fetchData = async () => {
      if (!token || !itemId || !categoryIdParm) return;

      try {
        setLoading(true);
        
          const items = await getItemsByCategory(token, parseInt(categoryIdParm), 1);
          const categs = await getCategories(token);
          setCategories(categs);
          console.log(items);
          const itemData = items.find((i: { id: number; }) => i.id === parseInt(itemId!));
          if (itemData) {
            setFormData({
              title: itemData.title,
              price: itemData.price,
              image: itemData.image,
              rarity: itemData.rarity,
              categoryId: itemData.categoryId
            });

            console.log(formData);
            
            setPreviewImage(imageUrl() + itemData.image);
            setIsNewImage(false);
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
      if (!token || !itemId) return;
      
      try {
        setLoadingForm(true);
        await updateItem(
          token,
          parseInt(itemId),
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
        setLoadingForm(false);
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
          <div className={styles.adminHeader}>
            <h1>Edytuj przedmiot</h1>
              <Link 
              to={formData.categoryId ? `/admin/shop/category/${formData.categoryId}` : '/admin/shop'} 
              className={styles.backButton}>
                  <i className="fas fa-arrow-left"></i> Powrót
              </Link>
          </div>
  
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
            {loading && <Loading/>}
  
            <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.formGrid}>
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
                </div>
              </div>
              <div className={styles.formColumn}>
                
              <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Rzadkosc:</label>                            
                  <select
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    <option value={"Common"}>Common</option>
                    <option value={"Rare"}>Rare</option>
                    <option value={"Epic"}>Epic</option>
                    <option value={"Uncommon"}>Uncommon</option>
                  </select>
              </div>
                <label className={styles.formLabel}>Kategoria:</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  required
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              </div>
                <div className={styles.formActions}>
                    <button 
                        type="submit" 
                        className={styles.primaryButton}
                        disabled={loadingForm}
                    >
                        {loadingForm ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Zapisywanie...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i> Zapisz zmiany
                            </>
                        )}
                    </button>
                  </div>
            </form>
          </div>
        </section>
        <Footer />
      </div>
    );
  };
  
  export default AdminShopEditItem;