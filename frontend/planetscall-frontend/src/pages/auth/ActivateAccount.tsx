import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';

const ActivateAccount = () => {
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7000/api/Auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd aktywacji konta');
      }

      navigate('/profile-settings'); // Przekierowanie do konfiguracji profilu
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Wystąpił błąd podczas aktywacji konta.');
    }
  };

  return (
    <div>
      <h1>Aktywuj Konto</h1>
      <form onSubmit={handleActivation}>
        <label>Kod aktywacyjny:</label>
        <input
          type="text"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          placeholder="Wprowadź kod aktywacyjny"
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Aktywuj</button>
      </form>
      
    </div>
  )
}

export default ActivateAccount
