//{/*Mozliwosc stworzenia organizacji*/}
import React, { useState } from 'react'
import Header from '../../components/shared/Header'
import { useAuth } from '../../context/AuthContext';
import { createOrganisation } from '../../services/communityService';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import styles from '../../stylePage/organisation/organisationAdmin.module.css';
import { convertImageToBase64 } from '../../services/imageConvert';
import NotAdmin from '../Additional/NotAdmin';
import NotAuthenticated from '../Additional/NotAuthenticated';


const CreateOrganisation = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string>('');

  
  { /* Data types fos specif variable in organisation data */} 
  const [formData, setFormData] = useState({
    name: '',
    uniqueName: '',
    description: '',
    organizationLogo: '',
    instagramLink: '',
    linkedinLink: '',
    youtubeLink: '',
    isPrivate: false,
    minimumJoinLevel: 0,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const base64Image = await convertImageToBase64(file);
        setFormData(prev => ({ ...prev, organizationLogo: base64Image }));
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
      setError('Musisz być zalogowany, aby stworzyć organizację.');
      return;
    }

    { /* Validation of requirement fields */} 
    if (!formData.name || !formData.uniqueName) {
      setError('Nazwa i unikalna nazwa są wymagane.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      { /* Sending data to create organisation */} 
      await createOrganisation(token, formData);
      navigate(`/community/organisation/${formData.uniqueName}`); 
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas tworzenia organizacji.');
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
                    <h1 className={styles.sectionTitle}>Stwórz Nową Organizację</h1>
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
                                <label className={styles.formLabel}>Logo Organizacji:</label>
                                <div className={styles.imageUploadContainer}>
                                    {previewImage && (
                                        <div className={styles.imagePreview}>
                                            <img 
                                                src={previewImage} 
                                                alt="Podgląd logo organizacji" 
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
                                <label className={styles.formLabel}>Nazwa:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Unikalna nazwa:</label>
                                <input
                                    type="text"
                                    name="uniqueName"
                                    value={formData.uniqueName}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Minimalny poziom dołączenia:</label>
                                <input
                                    type="number"
                                    name="minimumJoinLevel"
                                    value={formData.minimumJoinLevel}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Instagram Link:</label>
                                <input
                                    type="url"
                                    name="instagramLink"
                                    value={formData.instagramLink}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>LinkedIn Link:</label>
                                <input
                                    type="url"
                                    name="linkedinLink"
                                    value={formData.linkedinLink}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>YouTube Link:</label>
                                <input
                                    type="url"
                                    name="youtubeLink"
                                    value={formData.youtubeLink}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.checkboxGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="isPrivate"
                                        checked={formData.isPrivate}
                                        onChange={handleInputChange}
                                        className={styles.checkboxInput}
                                    />
                                    <span className={styles.checkboxCustom}></span>
                                    <span className={styles.checkboxText}>Prywatna organizacja</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Opis:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={styles.formTextarea}
                            rows={4}
                            required
                        />
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
                                    <i className="fas fa-plus"></i> Stwórz Organizację
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

export default CreateOrganisation
