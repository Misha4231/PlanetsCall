// src/components/shared/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();



  const isProfilePage = location.pathname.startsWith('/profile');
  const isOrganizationPage = location.pathname.startsWith('/organization');

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Strona Główna</Link></li>
          {isAuthenticated ? (
            <>
            {isProfilePage ? (
              <>
                <li><Link to="/profile">Profil</Link></li>
                <li><Link to="/profile/settings">Ustawienia</Link></li>
                <li><Link to="/profile/shop">Sklep</Link></li>
                <li><Link to="/profile/level">Lewel</Link></li>
                <li><Link to="/profile/achievements">Osiągnięcia</Link></li>
                <li><Link to="/profile/statistics">Statystyka</Link></li>
              </>
            ) : (
              <li><Link to="/profile">Profil</Link></li>
            )}
            {isOrganizationPage ? (
              <>
                <li><Link to="/organization">Organizacja Główna</Link></li>
                <li><Link to="/organization/details">Szczegóły Organizacji</Link></li>
              </>
            ) : (
              <li><Link to="/organization">Organizacja</Link></li>
            )}

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

export default Header;
