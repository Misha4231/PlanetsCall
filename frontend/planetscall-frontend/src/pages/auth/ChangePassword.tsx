import React, { useState } from 'react'
import { authHeader }  from  "../../services/authHeader";

const ChangePassword: React.FC = () => {

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirmation) {
      setError('Hasła muszą być identyczne.');
      return;
    }

    try {
      const response = await fetch(`${authHeader()}api/Auth/forgot-password/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwords: { password, passwordConfirmation },
          code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nie udało się zmienić hasła.');
      }

      setSuccess('Hasło zostało zmienione pomyślnie! Możesz się teraz zalogować.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Zmiana hasła</h1>
        <p>Wprowadź kod potwierdzenia:</p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <p>Wprowadź nowe hasło:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p>Potwierdź nowe hasło:</p>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Zmień hasło</button>
      </form>
      
    </div>
  )
}

export default ChangePassword
