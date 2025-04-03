import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService'; 
import { useAuth } from '../../context/AuthContext';

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
      console.error(err);
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
    <div className="app-container">
      <Header />
      <section className="blockCode">
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>

        <form onSubmit={handleSubmit}>
          <h1>Zaloguj się</h1>
          <div>
            <label>Email lub Nazwa użytkownika:</label>
            <input
              type="text"
              value={uniqueIdentifier}  
              onChange={(e) => setUniqueIdentifier(e.target.value)}
              placeholder="Podaj email lub nazwę użytkownika"
              required
            />
          </div>
          <div>
            <label>Hasło:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Podaj hasło"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Zaloguj się</button>
        </form>
        <ul>
          <li>
            <Link to="/auth/sign-up">Zarejestruj się</Link>
          </li>
          <li>
            <Link to="/auth/forgot-password">Nie pamiętam hasła</Link>
          </li>
        </ul>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default SignIn;
