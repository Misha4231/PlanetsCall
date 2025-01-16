import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== passwordConfirmation) {
      setError('Hasła nie są takie same.');
      return;
    }
    
    try {
      const response = await fetch('https://localhost:7000/api/Auth/forgot-password/change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwords: {
            password: newPassword,
            passwordConfirmation,
          },
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się zmienić hasła.');
      }

      setSuccess('Hasło zostało pomyślnie zmienione. Możesz się teraz zalogować.');
      setIsCodeSent(false);
      setIsPasswordChange(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Header />
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
        <form onSubmit={handlePasswordChange}>
          
          <h1>Potwierdź kod</h1>
          <p>Wprowadź kod, który otrzymałeś na mail:</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <h1>Zmień hasło</h1>
          <p>Wprowadź nowe hasło:</p>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p>Potwierdź nowe hasło:</p>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <button type="submit">Zmień hasło</button>
        </form>
      ) 
      }
      <ul>
        <li>
          <Link to="/auth/sign-up">Zarejestruj się</Link>
        </li>
        <li>
          <Link to="/auth/sign-in">Zaloguj się</Link>
        </li>
      </ul>
    </div>
  );
};

export default ForgotPassword;
