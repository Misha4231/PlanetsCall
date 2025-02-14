import React, { useState } from 'react';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      //const response = await fetch('https://localhost:7000/api/Auth/sign-up', {
      const response = await fetch('https://localhost:7000/api/Auth/development-sign-up', {
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
    <div>
      <Header />
      <form onSubmit={handleSignUp}>
        <h1>Zarejestruj się</h1>
        <div>
          <label>Nazwa użytkownika:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Zarejestruj się</button>
      </form>
          <ul>
            <li>
              <Link to="/auth/sign-in">Zaloguj się</Link>
            </li>
            <li>
              <Link to="/auth/forgot-password">Nie pamiętam hasła</Link>
            </li>
          </ul>
      <Footer />
    </div>
  );
};

export default SignUp;
