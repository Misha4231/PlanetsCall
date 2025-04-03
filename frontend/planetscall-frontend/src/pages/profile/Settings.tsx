import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserSettings } from '../../services/userService';
import Header from '../../components/shared/Header';
import { convertImageToBase64, imageUrl } from '../../services/imageConvert';
import '../../stylePage/profile.css';

const Settings: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
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
    cityId: 0,
    countryId: 0,
    themePreference: 0,
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
        profileImage: user.profileImage || '',
        preferredLanguage: user.preferredLanguage || '',
        isNotifiable: user.isNotifiable ?? false,
        isVisible: user.isVisible ?? false,
        description: user.description || '',
        instagramLink: user.instagramLink || '',
        linkedinLink: user.linkedinLink || '',
        youtubeLink: user.youtubeLink || '',
        cityId: user.cityId || 0,
        countryId: user.countryId || 0,
        themePreference: user.themePreference ?? 0,
        mailsSubscribed: user.mailsSubscribed ?? false,
      });
      if (user.profileImage) {
        setPreviewImage(imageUrl());
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
    
      console.log('Auth Token:', authToken);
      console.log('User ID:', userId);

      await updateUserSettings(authToken, userId, formData);


      alert('Dane zostały zaktualizowane!');
      navigate('/profile');  
    } catch (err: any) {
      alert(err.message || 'Nie udało się zapisać ustawień');
    }
  };

  if (!isAuthenticated) {
    return <p>Nie jesteś zalogowany!</p>;
  }

  return (
    <div>
      <Header/>
      <h1>Ustawienia Profilu</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Imię:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Nazwisko:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Zdjęcie Profilowe</label>
          {previewImage && (
            <div style={{ margin: '10px 0' }}>
              <img 
                src={previewImage} 
                alt="Podgląd zdjęcia profilowego" 
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <label>Preferowany Język:</label>
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleInputChange}
          >
            <option value="pl">Polski</option>
            <option value="en">Angielski</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isNotifiable"
              checked={formData.isNotifiable}
              onChange={handleInputChange}
            />
            Powiadomienia
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleInputChange}
            />
            Widoczny profil
          </label>
        </div>
        <div>
          <label>Opis:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Instagram Link:</label>
          <input
            type="text"
            name="instagramLink"
            value={formData.instagramLink}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>LinkedIn Link:</label>
          <input
            type="text"
            name="linkedinLink"
            value={formData.linkedinLink}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Youtube Link:</label>
          <input
            type="text"
            name="youtubeLink"
            value={formData.youtubeLink}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Miasto:</label>
          <input
            type="number"
            name="cityId"
            value={formData.cityId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Kraj:</label>
          <input
            type="number"
            name="countryId"
            value={formData.countryId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Motyw:</label>
          <select
            name="themePreference"
            value={formData.themePreference}
            onChange={handleInputChange}
          >
          <option value={0}>Ciemny</option>
          <option value={1}>Jasny</option>
          <option value={2}>Mieszany</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="mailsSubscribed"
              checked={formData.mailsSubscribed}
              onChange={handleInputChange}
            />
            Subskrypcja do otrzymywania emaili
          </label>
        </div>

        <button type="submit">Zapisz Zmiany</button>
      </form>
    </div>
  );
};

export default Settings;
