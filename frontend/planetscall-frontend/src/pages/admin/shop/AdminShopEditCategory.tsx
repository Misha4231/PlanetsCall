import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getCategories, updateCategory} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import Loading from '../../Additional/Loading';


const AdminShopEditCategory = () => {
    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
      title: '',
      image: ''
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isNewImage, setIsNewImage] = useState<boolean>(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (token && user?.isAdmin && id) {
        fetchCategoryData();
      }
    }, [token, user?.isAdmin, id]);
  
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const categories = await getCategories(token!);
        const category = categories.find((c: { id: number; }) => c.id === parseInt(id!));
        if (!category) throw new Error('Kategoria nie znaleziona');
        
        setFormData({
          title: category.title,
          image: category.image
        });
        
        setPreviewImage(imageUrl() + category.image);
        setIsNewImage(false);
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
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!token || !id) return;
      
      try {
        setLoadingForm(true);
        await updateCategory(
          token,
          parseInt(id),
          formData.title,
          formData.image
        );
        setSuccess('Kategoria została zaktualizowana pomyślnie');
        setTimeout(() => navigate(`/admin/shop/category/${id}`), 1000);
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
            <h1>Edytuj kategorię</h1>
              <Link to={`/admin/shop/category/${id}`} className={styles.backButton}>
                  <i className="fas fa-arrow-left"></i> Powrót
              </Link>
          </div>
  
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
            {loading && <Loading/>}
  
            <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Obraz:</label>
                <div className={styles.imageUploadContainer}>
                  {previewImage && (
                    <div className={styles.imagePreview}>
                      <img 
                        src={previewImage} 
                        alt="Podgląd obrazu kategorii" 
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
  
  export default AdminShopEditCategory;