import React, { useState } from 'react'
import { authHeader }  from  "../../services/authHeader";
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import authStyles from '../../stylePage/auth.module.css';

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
        <section className={`${authStyles.blockCode} ${authStyles.auth}`}>
          {loading ? (
            <p className={authStyles.loadingText}>Ładowanie...</p>
          ) : (
            <>
              <form onSubmit={handleSubmit} className={authStyles.form}>
                <h1 className={authStyles.title}>Zmiana hasła</h1>
                
                <div className={authStyles.instructionText}>
                  <p>Wprowadź kod potwierdzenia i nowe hasło</p>
                </div>
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Kod potwierdzenia:</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Wprowadź kod z emaila"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Nowe hasło:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Wprowadź nowe hasło"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Potwierdź nowe hasło:</label>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Powtórz nowe hasło"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                {error && (
                  <div className={authStyles.errorMessage}>
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className={authStyles.successMessage}>
                    {success}
                  </div>
                )}
                
                <button type="submit" className={authStyles.submitButton}>Zmień hasło</button>
              </form>
            </>
          )}
        </section>
        <Footer />
    </div>
  );
};

export default ChangePassword
