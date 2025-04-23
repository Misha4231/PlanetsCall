
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getCategories, addItems} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import NotAuthenticated from '../../Additional/NotAuthenticated';


interface Category {
  id: number;
  title: string;
}

const AdminShopCreateItem = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultCategoryId = queryParams.get('categoryId') || '0';
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string>('');

      useEffect(() => {
          if (token && user?.isAdmin) {
              const fetchData = async () => {  
                  try {
                      setLoading(true);
                      const org = await getCategories(token);
                      setCategories(org);
                      setError(null);
                  } catch (err: any) {
                      setError(err.message);
                  } finally {
                      setLoading(false);
                  }
              };
              fetchData();
          }    
      }, [token, user?.isAdmin, defaultCategoryId]);


  { /* Data types fos specif variable in item data */} 
  const [formData, setFormData] = useState({
    categoryId: parseInt(defaultCategoryId),
    price: 0,
    image: '',
    rarity: '',
    title: '',
  });

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
      setError('Musisz być zalogowany, aby stworzyć Item.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      console.log(token)

      { /* Sending data to create item */} 
      const response = await addItems(token, formData);
      setTimeout(() => navigate(`/admin/shop/category/${formData.categoryId}`), 1000);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas tworzenia itemu.');
    } finally {
      setLoading(false);
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
                    <h1 className={styles.sectionTitle}>Stwórz Nowy Item</h1>
                    <button 
                        onClick={() => navigate('/community')}
                        className={styles.secondaryButton}
                    >
                        <i className="fas fa-arrow-left"></i> Powrót
                    </button>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.settingsForm}>
                    <div className={styles.formGrid}>
                        <div className={styles.formColumn}>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label className={styles.formLabel}>Zdjęcie:</label>
                                <div className={styles.imageUploadContainer}>
                                    {previewImage && (
                                        <div className={styles.imagePreview}>
                                            <img 
                                                src={previewImage} 
                                                alt="Podgląd zdjęcia itemu" 
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
                                <label className={styles.formLabel}>Cena:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    min="0"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Rzadkość:</label>
                                <input
                                    type="text"
                                    name="rarity"
                                    value={formData.rarity}
                                    maxLength={30}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                  
                    <div className={styles.formActions}>
                        <button 
                            type="submit" 
                            className={styles.primaryButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Tworzenie...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-plus"></i> Stwórz Item
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

export default AdminShopCreateItem;