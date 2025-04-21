import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Member, Organisation } from '../community/communityTypes';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getOrganisationData, getOrganisationSettings, updateOrganisationSettings } from '../../services/communityService';
import styles from '../../stylePage/organisation/organisationAdmin.module.css';
import NotAdmin from '../Additional/NotAdmin';
import { convertImageToBase64, imageUrl } from '../../services/imageConvert';

const OrganisationSettings = () => {
    const { user, isAuthenticated, token } = useAuth();
    const [organisation, setOrganisation] = useState<Organisation | null>(null);
    const [formData, setFormData] = useState<Partial<Organisation>>({});

    const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();

    const [loading, setLoading] = useState<boolean>(false);
      const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');  
    const navigate = useNavigate();



    { /* Get data about organisation and its settings */} 
    useEffect(() => {
        if(token && organisationUniqueName){
        const fetchData = async () => {  
            try {
                setLoading(true);
                const orgData = await getOrganisationData(token, organisationUniqueName);
                setOrganisation(orgData);

                const orgSettings = await getOrganisationSettings(token, organisationUniqueName);
                setFormData(orgSettings);

                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if(formData.organizationLogo) {
          setPreviewImage(imageUrl() + formData.organizationLogo);
        }
        fetchData();
        }    
  }, [token, organisationUniqueName]);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64Image = await convertImageToBase64(file);
      setFormData(prev => ({ ...prev, organizationLogo: base64Image }));
      setPreviewImage(base64Image);
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Wystąpił błąd podczas przetwarzania zdjęcia');
    }
  };
  
  { /* Function to change settings of organisation */}
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

{ /* Function to send settings change to database */}
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !organisationUniqueName) {
        alert('Musisz być zalogowany.');
        return;
    }

    try {
        setLoading(true);
        await updateOrganisationSettings(token!, organisationUniqueName, formData);
        setSuccess('Pomyślnie zaaktulizowane dane.');
        setTimeout(() => navigate(`/community/organisation/${organisationUniqueName}/admin`), 1000);
        setError(null);
    } catch (err: any) {
        setError(err.message || 'Failed to update organisation settings.');
    } finally {
        setLoading(false);
    }
};



    if (!isAuthenticated) {
        return (<div>
          <Header/>
          <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>
          <Footer/>
    
    
        </div>);   
      }

      if(organisation?.creatorId!=user?.id){
        return (<NotAdmin/>)
      } 

    if (loading) {
        return (
            <div>
                <Header />
                <p>Loading...</p>
                <Footer />
            </div>
        );
    }

    return (
        <div className="app-container dark-theme">
          <Header/>
          <section className={styles.adminContainer}>
            {loading ? (
              <div className={styles.loading}>Ładowanie...</div>
            ) : (
              <div className={styles.adminContent}>
                <div className={styles.adminHeader}>
                  <h1 className={styles.sectionTitle}>Ustawienia Organizacji</h1>
                  <Link 
                    to={`/community/organisation/${organisationUniqueName}/admin`} 
                    className={styles.primaryButton}
                  >
                    <i className="fas fa-arrow-left"></i> Powrót
                  </Link>
                </div>
    
                {success && <div className={styles.successMessage}>{success}</div>}
                {error && <div className={styles.errorMessage}>{error}</div>}
    
                <form onSubmit={handleSubmit} className={styles.settingsForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formColumn}>

                    <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Logo:</label>
                    <div className={styles.imageUploadContainer}>
                      {formData.organizationLogo && (
                        <div className={styles.imagePreview}>
                          <img 
                            src={imageUrl() + formData.organizationLogo} 
                            alt="Podgląd loga organizacji" 
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
                          value={formData.name || ''}
                          onChange={handleInputChange}
                          className={styles.formInput}
                        />
                      </div>
    
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Unikalna nazwa:</label>
                        <input
                          type="text"
                          name="uniqueName"
                          value={formData.uniqueName || ''}
                          onChange={handleInputChange}
                          className={styles.formInput}
                        />
                      </div>
    
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Minimalny poziom dołączenia:</label>
                        <input
                          type="number"
                          name="minimumJoinLevel"
                          value={formData.minimumJoinLevel || 0}
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
                          type="text"
                          name="instagramLink"
                          value={formData.instagramLink || ''}
                          onChange={handleInputChange}
                          className={styles.formInput}
                        />
                      </div>
    
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>LinkedIn Link:</label>
                        <input
                          type="text"
                          name="linkedinLink"
                          value={formData.linkedinLink || ''}
                          onChange={handleInputChange}
                          className={styles.formInput}
                        />
                      </div>
    
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>YouTube Link:</label>
                        <input
                          type="text"
                          name="youtubeLink"
                          value={formData.youtubeLink || ''}
                          onChange={handleInputChange}
                          className={styles.formInput}
                        />
                      </div>
    
                      <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            name="isPrivate"
                            checked={formData.isPrivate || false}
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
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className={styles.formTextarea}
                      rows={4}
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
            )}
        </section>
        <Footer/>
    </div>
    );
};

export default OrganisationSettings;

