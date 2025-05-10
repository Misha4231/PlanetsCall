import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {addCategory} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/organisation/organisationAdmin.module.css';
import NotAuthenticated from '../../Additional/NotAuthenticated';


const AdminShopCreateCategory = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string>('');

  
  { /* Data types fos specif variable in category data */} 
  const [formData, setFormData] = useState({
    title: '',
    image: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        setError('Zdjęcie nie może być większe niż 5MB');
        return;
    }

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
      setLoading(true);
      setError(null);
      setSuccess(null);

      { /* Sending data to create category */} 
      await addCategory(token, formData.title, formData.image);
      setSuccess('Kategoria została dodana');
      setTimeout(() => navigate('/admin/shop'), 1000);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas tworzenia kategorii.');
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
                    <h1 className={styles.categoryTitle}>Stwórz Nową kategorię</h1>
                    <Link to="/admin/shop" className={styles.backButton}>
                        <i className="fas fa-arrow-left"></i> Powrót
                    </Link>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>{success}</p>}

                <form onSubmit={handleSubmit} className={styles.settingsForm}>
                    <div className={styles.formGrid}>
                        <div className={styles.formColumn}>
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

export default AdminShopCreateCategory
