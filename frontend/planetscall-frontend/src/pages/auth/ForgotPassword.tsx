import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import { Link, useNavigate } from 'react-router-dom';
import { authHeader }  from  "../../services/headers";
import Footer from '../../components/Footer/Footer';
import authStyles from '../../stylePage/auth.module.css';

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

    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
      const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingSubmit(true);
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
      navigate('/auth/change-password'); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
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
              <h1 className={authStyles.title}>Zapomniałeś hasła?</h1>
              <div className={authStyles.instructionText}>
                <p></p>
              </div>
              
              <div className={authStyles.inputGroup}>
                <label className={authStyles.label}>Nazwa użytkownika lub e-mail:</label>
                <input
                  type="text"
                  value={uniqueIdentifier}
                  onChange={(e) => setUniqueIdentifier(e.target.value)}
                  placeholder="Wprowadź swoją nazwę użytkownika lub email"
                  required
                  className={authStyles.input}
                />
              </div>
              
              {error && <div className={authStyles.errorMessage}>{error}</div>}
              {success && <div className={authStyles.successMessage}>{success}</div>}
              
              <button type="submit" className={authStyles.submitButton} disabled={loadingSubmit}>
              {loadingSubmit ? (
                  <span className={authStyles.buttonLoader}></span>
                ) : (
                  'Wyślij kod'
                )}</button>
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

export default ForgotPassword;
