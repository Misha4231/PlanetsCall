import React, { useEffect, useState }  from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';

const ActivateAccount = () => {
  const location = useLocation();
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeFromUrl = params.get('code');
    if (codeFromUrl) {
      setActivationCode(codeFromUrl); // Automatycznie ustaw kod z URL
    }
  }, [location]);


  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const encodedCode = encodeURIComponent(activationCode);
      const response = await fetch('https://localhost:7000/api/Auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Szczegóły błędu:', errorData); 
        throw new Error(errorData.message || 'Błąd aktywacji konta');
      }
  
      navigate('/profile/settings'); 
    } catch (err: any) {
      console.error('Błąd:', err);
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
