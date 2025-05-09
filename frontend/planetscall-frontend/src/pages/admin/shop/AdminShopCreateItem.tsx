import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {addItems} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import NotAuthenticated from '../../Additional/NotAuthenticated';

interface ItemShop {    
  "categoryId": number,
  "price": number,
  "image": string,
  "rarity": RarityType,
  "title": string
}

type RarityType = "Common" | "Rare" | "Epic";

const AdminShopCreateItem = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [previewImage, setPreviewImage] = useState<string>('');

  
  { /* Data types fos specif variable in category data */} 
  const [formData, setFormData] = useState<ItemShop>({ 
    "categoryId": 0,
    "price": 0,
    "image": "",
    "rarity": "Common" as RarityType,
    "title": ""
  });

    useEffect(() => {
      if (token && user?.isAdmin && categoryId) {
        fetchData();
      }
    }, [token, user?.isAdmin, categoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setFormData(prev => ({ ...prev, categoryId: parseInt(categoryId!) }));
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
    } catch (error) {
        console.error('Error converting image:', error);
        setError('Wystąpił błąd podczas przetwarzania zdjęcia');
    }
};

  { /* Function to form management */} 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
};

  { /* Function to send form to database */} 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      setError('Musisz być zalogowany, aby stworzyć kategorię.');
      return;
    }

    { /* Validation of requirement fields */} 
    if (!formData.title || !formData.image) {
      setError('Tytuł i zdjęcie kategorii są wymagane.');
      return;
    }

    try {
      setLoadingForm(true);
      setError(null);
      setSuccess(null);
    if(!token || !categoryId) return;

      { /* Sending data to create category */} 
      console.log(formData);
      const newItemData: ItemShop = await addItems(token, formData);
      setSuccess('Item został dodany');
      setTimeout(() => navigate(`/admin/shop/category/${newItemData.categoryId}`), 1000);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas tworzenia kategorii.');
    } finally {
      setLoadingForm(false);
    }
  };

  if (!isAuthenticated) {
    return (<NotAuthenticated/>
    );   
  }

  if(!user?.isAdmin) {
    return <NotAdmin/>;
  }
  
  return (
    <div className="app-container dark-theme">
        <Header />
        <section className={styles.adminContainer}>
            <div className={styles.adminContent}>
                <div className={styles.adminHeader}>
                    <h1 className={styles.categoryTitle}>Stwórz Nową kategorię</h1>
                    <Link to={`/admin/shop/category/${categoryId}`} className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i> Powrót
                    </Link>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <p className={styles.successMessage}>{success}</p>}

                <form onSubmit={handleSubmit} className={styles.settingsForm}>
                    <div className={styles.formGrid}>
                        <div className={styles.formColumn}>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Nazwa:</label>
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
                                <label className={styles.formLabel}>Koszt:</label>
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
                                </select>
                            </div>
                            
                        </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>Znaczek kategorii:</label>
                                <div className={styles.imageUploadContainer}>
                                    {previewImage && (
                                        <div className={styles.imagePreview}>
                                            <img 
                                                src={previewImage} 
                                                alt="Podgląd logo kategorii" 
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
                                        <span className={styles.fileInputButton}>Wybierz zdjęcie</span>
                                    </label>
                                </div>
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
                                    <i className="fas fa-spinner fa-spin"></i> Tworzenie...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus"></i> Stwórz kategorię
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
}

export default AdminShopCreateItem
