import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://localhost:7000/api/Auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uniqueIdentifier }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie znaleziono użytkownika.');
      }

      setIsCodeSent(true);
      setSuccess('Kod został wysłany na Twój adres e-mail.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://localhost:7000/api/Auth/forgot-password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Niepoprawny kod.');
      }

      setSuccess('Kod został zweryfikowany! Możesz teraz zmienić hasło.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      {!isCodeSent ? (
        <form onSubmit={handleSubmit}>
          <h1>Zapomniałeś hasła?</h1>
          <p>Wprowadź nazwę użytkownika lub e-mail:</p>
          <input
            type="text"
            value={uniqueIdentifier}
            onChange={(e) => setUniqueIdentifier(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit">Wyślij kod</button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit}>
          <h1>Potwierdź kod</h1>
          <p>Wprowadź kod, który otrzymałeś na mail:</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit">Zweryfikuj kod</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
