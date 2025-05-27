import React, { useEffect, useState } from 'react'
import { authHeader }  from  "../../services/headers";
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import authStyles from '../../stylePage/auth.module.css';
import { Link, useLocation } from 'react-router-dom';

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    const codeUrl = urlParams.get('code');
    
    if (codeUrl) {
      setCode(codeUrl);
    }
  }, []);



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
        <section className={`${authStyles.blockCode} ${authStyles.auth}`}>
          {loading ? (
            <p className={authStyles.loadingText}>Ładowanie...</p>
          ) : (
            <>
              <form onSubmit={handlePasswordChange} className={authStyles.form}>
                <h1 className={authStyles.title}>Resetowanie hasła</h1>
                
                {!code && (
                  <div className={authStyles.inputGroup}>
                    <label className={authStyles.label}>Kod weryfikacyjny:</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Wprowadź kod z emaila"
                      required
                      className={authStyles.input}
                    />
                  </div>
                )}
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Nowe hasło:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                
                {error && <div className={authStyles.errorMessage}>{error}</div>}
                {success && <div className={authStyles.successMessage}>{success}</div>}
                
                <button type="submit" className={authStyles.submitButton}>Zmień hasło</button>
              </form>
          
              <div className={authStyles.linksContainer}>
                <ul className={authStyles.linksList}>
                  <li className={authStyles.linkItem}>
                    <Link to="/auth/sign-up" className={authStyles.link}>
                      <i className="fas fa-user-plus"></i> Zarejestruj się
                    </Link>
                  </li>
                  <li className={authStyles.linkItem}>
                    <Link to="/auth/sign-in" className={authStyles.link}>
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

export default ChangePassword
