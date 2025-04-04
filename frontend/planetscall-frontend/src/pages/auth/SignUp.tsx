import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { authHeader }  from  "../../services/authHeader";
import '../../stylePage/auth.css'

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      //const response = await fetch(authHeader + 'api/Auth/sign-up', {
      const response = await fetch(`${authHeader()}api/Auth/development-sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          passwords: {
            password,
            passwordConfirmation: password,
          },
          agreedToTermsOfService: true, 
        }),
      });
  
      const responseText = await response.text(); 
  
      if (!response.ok) {
        console.log(responseText); 
        const errorData = JSON.parse(responseText);
        if (errorData.errors && errorData.errors.CustomValidation) {
          if (errorData.errors.CustomValidation.includes('User with the same username already exists')) {
            throw new Error('Użytkownik o podanej nazwie już istnieje. Wybierz inną nazwę.');
          }
        }
        
        throw new Error(errorData.message || 'Rejestracja nie powiodła się.');
      }
  
      setSuccess('Rejestracja przebiegła pomyślnie! Sprawdź swój email, aby aktywować konto.');
      setTimeout(() => navigate('/auth/activate-account'), 3000);
    } catch (err: any) {
      console.log('Error:', err); 
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
            <form onSubmit={handleSignUp}>
              <h1>Zarejestruj się</h1>
              
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
              
              <div className="input-group">
                <label>Nazwa użytkownika:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Wprowadź nazwę użytkownika"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Wprowadź adres email"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Hasło:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wprowadź hasło"
                  required
                />
              </div>
              
              <button type="submit">Zarejestruj się</button>
            </form>
            
            <div className="links-container">
              <ul>
                <li>
                  <Link to="/auth/sign-in">Zaloguj się</Link>
                </li>
                <li>
                  <Link to="/auth/forgot-password">Nie pamiętam hasła</Link>
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
