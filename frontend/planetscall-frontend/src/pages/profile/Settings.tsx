import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFullUser, updateUserSettings } from '../../services/userService';
import Header from '../../components/shared/Header';
import { convertImageToBase64, imageUrl } from '../../services/imageConvert';
import Footer from '../../components/Footer/Footer';
import styles from '../../stylePage/profile.module.css';
import NotAuthenticated from '../Additional/NotAuthenticated';

type ThemeType = 0 | 1 | 2;

const Settings: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    profileImage: '',
    preferredLanguage: '',
    isNotifiable: false,
    isVisible: false,
    description: '',
    instagramLink: '',
    linkedinLink: '',
    youtubeLink: '',
    themePreference: 0 as ThemeType,
    mailsSubscribed: false,
  });

  const [previewImage, setPreviewImage] = useState<string>('');  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profileImage: (user.profileImage || ''),
        preferredLanguage: user.preferredLanguage || '',
        isNotifiable: user.isNotifiable ?? false,
        isVisible: user.isVisible ?? false,
        description: user.description || '',
        instagramLink: user.instagramLink || '',
        linkedinLink: user.linkedinLink || '',
        youtubeLink: user.youtubeLink || '',
        themePreference: user.themePreference ?? 0,
        mailsSubscribed: user.mailsSubscribed ?? false,
      });
      if (user.profileImage) {
        setPreviewImage(imageUrl() + user.profileImage);
      }
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Image = await convertImageToBase64(file);
      setFormData(prev => ({ ...prev, profileImage: base64Image }));
      setPreviewImage(base64Image);
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Wystąpił błąd podczas przetwarzania zdjęcia');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const isChecked = checkbox.checked;
  
      setFormData(prevData => ({
        ...prevData,
        [name]: isChecked,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Musisz być zalogowany, aby zaktualizować ustawienia');
      return;
    }

    try {
      const authToken = token || ''; 
      const userId = user?.id;

      if (!userId) {
        alert('Nie można zaktualizować ustawień: brak identyfikatora użytkownika');
        return;
      }

      await updateUserSettings(authToken, userId, formData);
      setSuccess("Pomyślnie zaktulizowano ustawienia");
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err: any) {
      alert(err.message || 'Nie udało się zapisać ustawień');
    }
  };

  if (!isAuthenticated || !user) {
    return (<NotAuthenticated/>
    );   
  }

  return (
    <div className="app-container dark-theme">
      <Header/>
      <section className={`${styles.profileContainer} app-container dark-theme`}>
        {loading ? (
          <p className={styles.loadingText}>Ładowanie...</p>
        ) : (
          <div className={styles.profileContent}>
            <h1 className={styles.settingsTitle}>Ustawienia Profilu</h1>
            {success && <div className={styles.successMessage}>{success}</div>}
            {error && <p className={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.settingsForm}>
              <div className={styles.formGrid}>
                <div className={styles.formColumn}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.formLabel}>Zdjęcie Profilowe:</label>
                    <div className={styles.imageUploadContainer}>
                      {previewImage && (
                        <div className={styles.imagePreview}>
                          <img 
                            src={previewImage} 
                            alt="Podgląd zdjęcia profilowego" 
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

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Wprowadź email"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nazwa użytkownika:</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Wprowadź nazwę użytkownika"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Imię:</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Wprowadź imię"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nazwisko:</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Wprowadź nazwisko"
                    />
                  </div>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferowany Język:</label>
                    <select
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="pl">Polski</option>
                      <option value="en">Angielski</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Motyw:</label>
                    <select
                      name="themePreference"
                      value={formData.themePreference}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value={0}>Ciemny</option>
                      <option value={1}>Jasny</option>
                      <option value={2}>Mieszany</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Opis profilu:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      maxLength={300}
                      placeholder="Dodaj opis swojego profilu"
                    />
                  </div>
                  <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Preferencje</h3>
                <div className={styles.checkboxGroupContainer}>
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="isNotifiable"
                        checked={formData.isNotifiable}
                        onChange={handleInputChange}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}></span>
                      <span className={styles.checkboxText}>Powiadomienia</span>
                    </label>
                  </div>

                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="isVisible"
                        checked={formData.isVisible}
                        onChange={handleInputChange}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}></span>
                      <span className={styles.checkboxText}>Widoczny profil</span>
                    </label>
                  </div>

                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="mailsSubscribed"
                        checked={formData.mailsSubscribed}
                        onChange={handleInputChange}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}></span>
                      <span className={styles.checkboxText}>Subskrypcja email</span>
                    </label>
                  </div>
                </div>
              </div>
                </div>
              </div>



              <div className={styles.socialLinksSection}>
                <h3 className={styles.sectionTitle}>Linki społecznościowe</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Instagram:</label>
                  <input
                    type="url"
                    name="instagramLink"
                    value={formData.instagramLink}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="https://instagram.com/twojprofil"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>LinkedIn:</label>
                  <input
                    type="url"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="https://linkedin.com/in/twojprofil"
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryButton}>
                  <i className="fas fa-save"></i> Zapisz Zmiany
                </button>
                <button 
                  type="button" 
                  className={styles.secondaryButton}
                  onClick={() => navigate('/profile')}
                >
                  <i className="fas fa-times"></i> Anuluj
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default Settings;
