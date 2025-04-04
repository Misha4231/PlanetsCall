import React, { useState } from 'react'
import { authHeader }  from  "../../services/authHeader";
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import '../../stylePage/auth.css'

const ChangePassword: React.FC = () => {

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirmation) {
      setError('Hasła muszą być identyczne.');
      return;
    }

    try {
      const response = await fetch(`${authHeader()}api/Auth/forgot-password/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwords: { password, passwordConfirmation },
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się zmienić hasła.');
      }

      setSuccess('Hasło zostało zmienione pomyślnie! Możesz się teraz zalogować.');
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
            <form onSubmit={handleSubmit}>
              <h1>Zmiana hasła</h1>
              
              <div className="instruction-text">
                <p>Wprowadź kod potwierdzenia i nowe hasło</p>
              </div>
              
              <div className="input-group">
                <label>Kod potwierdzenia:</label>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}
              
              <button type="submit">Zmień hasło</button>
            </form>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ChangePassword
