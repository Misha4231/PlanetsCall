import React, { useEffect, useState }  from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { authHeader }  from  "../../services/headers";
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import authStyles from '../../stylePage/auth.module.css';
import { activationAccount } from '../../services/authService';

const ActivateAccount = () => {
  const location = useLocation();
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [codeByLink, setCodeByLink] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    const codeUrl = urlParams.get('code');
    
    if (codeUrl) {
      setCodeByLink(true);
      setActivationCode(codeUrl);
    }
  }, []);


  const handleActivation = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const encodedCode = encodeURIComponent(activationCode);
      await activationAccount(activationCode);
  
      navigate('/auth/sign-in'); 
    } catch (err: any) {
      console.error('Błąd:', err);
      setError(err.message || 'Wystąpił błąd podczas aktywacji konta.');
    }
  };
  

  return (
    <div className="app-container">
    <Header/>
    <section className={authStyles.blockCode}>
      {loading ? (
        <p className={authStyles.loadingText}>Ładowanie...</p>
      ) : (
        <>
          <h1 className={authStyles.title}>Aktywuj Konto</h1>
          <form onSubmit={handleActivation} className={authStyles.form}>
            {!codeByLink && (
              <>
                <label className={authStyles.label}>Kod aktywacyjny:</label>
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder="Wprowadź kod aktywacyjny"
                  required
                  className={authStyles.input}
                />
              </>
            )}
            
            {error && <p className={authStyles.errorMessage}>{error}</p>}
            <button type="submit" className={authStyles.submitButton}>Aktywuj</button>
          </form>
        </>
      )}
    </section>
    <Footer/>
      
    </div>
  )
}

export default ActivateAccount
