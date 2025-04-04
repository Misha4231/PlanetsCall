import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService'; 
import { useAuth } from '../../context/AuthContext';
import '../../stylePage/auth.css'

const SignIn = () => {
  const { login: loginUser, isAuthenticated } = useAuth();
  const [uniqueIdentifier, setUniqueIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);


    try {
      await loginUser(uniqueIdentifier, password);
    
      console.log("Zalogowano");
      navigate('/profile'); 
    } catch (err: any) {
      setError(err.message || 'Błąd logowania. Sprawdź dane i spróbuj ponownie.');
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
      <section className="blockCode auth">
        {loading ? (
          <p className="loading-text">Ładowanie...</p>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <h1>Zaloguj się</h1>
              {error && <p className="error-message">{error}</p>}
              
              <div className="input-group">
                <label>Email lub Nazwa użytkownika:</label>
                <input
                  type="text"
                  value={uniqueIdentifier}  
                  onChange={(e) => setUniqueIdentifier(e.target.value)}
                  placeholder="Podaj email lub nazwę użytkownika"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Hasło:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Podaj hasło"
                  required
                />
              </div>
              
              <button type="submit">Zaloguj się</button>
            </form>
            
            <div className="links-container">
              <ul>
                <li>
                  <Link to="/auth/sign-up">Zarejestruj się</Link>
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

export default SignIn;
