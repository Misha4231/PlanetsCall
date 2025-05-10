import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { authHeader }  from  "../../services/headers";
import authStyles from '../../stylePage/auth.module.css';
import { signUpUser } from '../../services/authService';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingUser(true)
    setSuccess(null);
  


    try {
      if (!agreedToTerms) {
        setError('Musisz zaakceptować warunki korzystania z usługi.');
      } else {
        //const response = await fetch(authHeader + 'api/Auth/sign-up', {
        const response = await signUpUser(username, email, password, passwordConfirmation, agreedToTerms);
    
        setSuccess('Rejestracja przebiegła pomyślnie! Sprawdź swój email, aby aktywować konto.');
        setTimeout(() => navigate('/auth/activate-account'), 3000);
      }
    } catch (err: any) {
      console.log('Error:', err); 
      setError(err.message || 'Wystąpił nieoczekiwany błąd.');
    } finally {
      setLoadingUser(false);
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
              <form onSubmit={handleSignUp} className={authStyles.form}>
                <h1 className={authStyles.title}>Zarejestruj się</h1>
                
                {error && <p className={authStyles.errorMessage}>{error}</p>}
                
                {success && (
                  <div className={authStyles.successMessage}>
                    {success}
                  </div>
                )}
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Nazwa użytkownika:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Wprowadź nazwę użytkownika"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Wprowadź adres email"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Hasło:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Wprowadź hasło"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Potwierdź hasło:</label>
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Wprowadź ponownie hasło"
                    required
                    className={authStyles.input}
                  />
                </div>

                <div className={authStyles.inputGroup}>
                  <label className={authStyles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className={authStyles.checkbox}
                    />
                    Akceptuję <Link to="https://www.termsfeed.com/live/9bf35c82-b1eb-4ee4-a14c-74b0220b4235" target="_blank" className={authStyles.termsLink}>Warunki korzystania z usługi</Link>
                  </label>
                </div>

                <button type="submit" className={authStyles.submitButton} disabled={loadingUser}>
                {loadingUser ? (
                  <span className={authStyles.buttonLoader}></span>
                ) : (
                  'Zajerestruj się'
                )}
                </button>

              </form>
                        
              <div className={authStyles.linksContainer}>
                <ul className={authStyles.linksList}>
                  <li className={authStyles.linkItem}>
                    <Link to="/auth/sign-in" className={authStyles.link}><i className="fas fa-sign-in-alt"></i> Zaloguj się</Link>
                  </li>
                  <li className={authStyles.linkItem}>
                      <Link to="/auth/forgot-password" className={authStyles.link}><i className="fas fa-key"></i>Nie pamiętam hasła</Link>
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

export default SignUp;
