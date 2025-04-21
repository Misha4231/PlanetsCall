import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {addCategory} from '../../../services/shopService';
import Header from '../../../components/shared/Header';
import Footer from '../../../components/Footer/Footer';
import { convertImageToBase64, imageUrl } from '../../../services/imageConvert';
import NotAdmin from '../../Additional/NotAdmin';
import styles from '../../../stylePage/admin/adminShop.module.css';


const AdminShopCreateCategory = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: ''
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const navigate = useNavigate();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setLoading(true);
      await addCategory(token, formData.title, formData.image);
      setSuccess('Kategoria została dodana pomyślnie');
      setTimeout(() => navigate('/admin/shop'), 1000);
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
          <h1>Dodaj nową kategorię</h1>
          <Link to="/admin/shop" className={styles.backLink}>Powrót do sklepu</Link>

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
                    required
                  />
                  <span className={styles.fileInputButton}>Wybierz obraz</span>
                </label>
              </div>
            </div>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              Dodaj kategorię
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AdminShopCreateCategory;