import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
    preferences: '',
    language: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://localhost:7000/api/profiles/set-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd aktualizacji profilu');
      }

      navigate('/'); 
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Nie udało się zapisać ustawień');
    }
  };

  return (
    <div>
    <h1>Ustawienia Profilu</h1>
    {step === 1 && (
      <div>
        <label>Imię:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <label>Nazwisko:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <button onClick={handleNext}>Dalej</button>
      </div>
    )}
    {step === 2 && (
      <div>
        <label>Zdjęcie Profilowe (URL):</label>
        <input
          type="text"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleInputChange}
        />
        <button onClick={handleBack}>Wstecz</button>
        <button onClick={handleNext}>Dalej</button>
      </div>
    )}
    {step === 3 && (
      <div>
        <label>Preferencje:</label>
        <input
          type="text"
          name="preferences"
          value={formData.preferences}
          onChange={handleInputChange}
        />
        <label>Język:</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          required
        >
          <option value="">Wybierz język</option>
          <option value="pl">Polski</option>
          <option value="en">Angielski</option>
        </select>
        <button onClick={handleBack}>Wstecz</button>
        <button onClick={handleSubmit}>Zapisz</button>
      </div>
    )}
      
    </div>
  )
}

export default Settings
