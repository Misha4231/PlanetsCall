import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import { Link } from 'react-router-dom';
import { authHeader }  from  "../../services/authHeader";
import Footer from '../../components/Footer/Footer';
import '../../stylePage/auth.css'

const ForgotPassword: React.FC = () => {
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      const response = await fetch(`${authHeader()}api/Auth/forgot-password`, {
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
      const response = await fetch(`${authHeader()}api/Auth/forgot-password/change`, {
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
    <div className="app-container dark-theme">
      <Header />
      <section className="blockCode auth">
        {loading ? (
          <p className="loading-text">Ładowanie...</p>
        ) : (
          <>
            {!isCodeSent ? (
              <form onSubmit={handleSubmit} className="auth-form">
                <h1>Zapomniałeś hasła?</h1>
                <div className="instruction-text">
                  <p>Wprowadź nazwę użytkownika lub e-mail</p>
                </div>
                
                <div className="input-group">
                  <label>Nazwa użytkownika lub e-mail:</label>
                  <input
                    type="text"
                    value={uniqueIdentifier}
                    onChange={(e) => setUniqueIdentifier(e.target.value)}
                    placeholder="Wprowadź swoją nazwę użytkownika lub email"
                    required
                  />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button type="submit" className="submit-button">Wyślij kod</button>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="auth-form">
                <h1>Resetowanie hasła</h1>
                
                <div className="input-group">
                  <label>Kod weryfikacyjny:</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Wprowadź kod z emaila"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Nowe hasło:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Wprowadź nowe hasło"
                    required
                  />
                </div>
                
                <div className="input-group">
                  <label>Potwierdź nowe hasło:</label>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Powtórz nowe hasło"
                    required
                  />
                </div>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <button type="submit" className="submit-button">Zmień hasło</button>
              </form>
            )}
            
            <div className="auth-links">
              <ul>
                <li>
                  <Link to="/auth/sign-up">
                    <i className="fas fa-user-plus"></i> Zarejestruj się
                  </Link>
                </li>
                <li>
                  <Link to="/auth/sign-in">
                    <i className="fas fa-sign-in-alt"></i> Zaloguj się
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
