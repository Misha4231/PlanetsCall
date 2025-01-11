import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import useAuth from '../../hooks/useAuth';  
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService'; 

const SignIn = () => {
  const { login: loginUser } = useAuth();
  const [uniqueIdentifier, setUniqueIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);


    try {
      const userData = await login(uniqueIdentifier, password);
    
      console.log("Zalogowano");
      console.log(userData);
      navigate('/profile'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Błąd logowania. Sprawdź dane i spróbuj ponownie.');
    }
  };

  return (
    <div>
      <Header />
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
        <li>
          <Link to="/">Strona Główna</Link>
        </li>
      </ul>
      <Footer />
    </div>
  );
};

export default SignIn;
