// src/pages/auth/SignIn.tsx
import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import useAuth from '../../hooks/useAuth';  
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/authService'; 

const SignIn = () => {
  const { login: loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser(email, password);  
      setError('Logowanie');
    } catch (err) {
      setError('Błąd logowania. Sprawdź dane i spróbuj ponownie.');
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <h1>Zaloguj się</h1>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hasło:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Wyświetlanie błędu */}
        <button type="submit">Zaloguj się</button>
      </form>
      
              <ul>
                <li><Link to="/auth/sign-up">Zajerestruj się</Link></li>
                <li><Link to="/">Nie pamiętam hasła</Link></li>
                <li><Link to="/">Strona Główna</Link></li>
              </ul>
      <Footer />
    </div>
  );
};

export default SignIn;
