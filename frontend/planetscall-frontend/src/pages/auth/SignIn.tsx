import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService'; 
import { useAuth } from '../../context/AuthContext';
import authStyles from '../../stylePage/auth.module.css';
import { getAddAttendance } from '../../services/userService';

const SignIn = () => {
  const { token, login: loginUser, isAuthenticated } = useAuth();
  const [uniqueIdentifier, setUniqueIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingUser(true);


    try {
      await loginUser(uniqueIdentifier, password);
    
      console.log("Zalogowano");
      navigate('/profile'); 
    } catch (err: any) {
      setError(err.message || 'Błąd logowania. Sprawdź dane i spróbuj ponownie.');
    } finally {
      setLoadingUser(false);
    }
  };



  if(isAuthenticated){
    navigate('/profile'); 
    return(<div>
      <Header />
      <h2>Jestes juz zalogowany</h2>
      </div>)
  }

  return (
    <div className="app-container dark-theme ">
      <Header />
        <section className={`${authStyles.blockCode} ${authStyles.auth}`}>
          {loading ? (
            <p className={authStyles.loadingText}>Ładowanie...</p>
          ) : (
            <>
              <form onSubmit={handleSubmit} className={authStyles.form}>
                <h1 className={authStyles.title}>Zaloguj się</h1>
                {error && <p className={authStyles.errorMessage}>{error}</p>}
                
                <div className={authStyles.inputGroup}>
                  <label className={authStyles.label}>Email lub Nazwa użytkownika:</label>
                  <input
                    type="text"
                    value={uniqueIdentifier}
                    onChange={(e) => setUniqueIdentifier(e.target.value)}
                    placeholder="Podaj email lub nazwę użytkownika"
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
                    placeholder="Podaj hasło"
                    required
                    className={authStyles.input}
                  />
                </div>
                
                <button type="submit" className={authStyles.submitButton} disabled={loadingUser}>
                {loadingUser ? (
                  <span className={authStyles.buttonLoader}></span>
                ) : (
                  'Zaloguj się'
                )}
                </button>
              </form>

              <div className={authStyles.linksContainer}>
                <ul className={authStyles.linksList}>
                  <li className={authStyles.linkItem}>
                    <Link to="/auth/sign-up" className={authStyles.link}><i className="fas fa-user-plus"></i> Zarejestruj się</Link>
                  </li>
                  {/* <li className={authStyles.linkItem}>
                    <Link to="/auth/forgot-password" className={authStyles.link}><i className="fas fa-key"></i>Nie pamiętam hasła</Link>
                  </li> */}
                </ul>
              </div>

            </>
          )}
        </section>
        <Footer />
    </div>
  );
};

export default SignIn;
