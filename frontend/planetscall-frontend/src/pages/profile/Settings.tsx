import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserSettings } from '../../services/authService';

const Settings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
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
  
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profileImage: user.profile_image || '',
        preferredLanguage: user.preferredLanguage || '',
        isNotifiable: user.isNotifiable ?? false,
        isVisible: user.isVisible ?? false,
        description: user.description || '',
        instagramLink: user.instagramLink || '',
        linkedinLink: user.linkedinLink || '',
        youtubeLink: user.youtubeLink || '',
        cityId: user.cityId || 0,
        countryId: user.countryId || 0,
        themePreference: user.theme_preference ?? 0,
        mailsSubscribed: user.mailsSubscribed ?? false,
      });
    }
  }, [user]);

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
      const authToken = localStorage.getItem('authToken') || ''; 
      const response = await updateUserSettings(authToken, formData);


      alert('Dane zostały zaktualizowane!');
      navigate('/');  
    } catch (err: any) {
      alert(err.message || 'Nie udało się zapisać ustawień');
    }
  };

  if (!isAuthenticated) {
    return <p>Nie jesteś zalogowany!</p>;
  }

  return (
    <div>
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
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Profile Image (URL):</label>
          <input
            type="text"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Preferred Language:</label>
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
            Receive notifications
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
            Make profile visible
          </label>
        </div>
        <div>
          <label>Description:</label>
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
          <label>City:</label>
          <input
            type="number"
            name="cityId"
            value={formData.cityId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="number"
            name="countryId"
            value={formData.countryId}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Theme Preference:</label>
          <select
            name="themePreference"
            value={formData.themePreference}
            onChange={handleInputChange}
          >
            <option value={0}>Light</option>
            <option value={1}>Dark</option>
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
            Subscribe to mails
          </label>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
