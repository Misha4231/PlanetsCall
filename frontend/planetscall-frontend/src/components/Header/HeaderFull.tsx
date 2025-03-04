// src/components/shared/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HeaderFull: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Strona Główna</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/profile">Profil</Link></li>
              {user?.isAdmin && <li><Link to="/admin">Panel Administracyjny</Link></li>}
              <li><button onClick={logout}>Wyloguj</button></li>
            </>
          ) : (
            <li><Link to="/auth/sign-in">Zaloguj się</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default HeaderFull;
