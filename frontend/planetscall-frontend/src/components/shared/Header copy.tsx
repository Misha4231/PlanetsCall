// src/components/shared/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();



  const isProfilePage = location.pathname.startsWith('/profile');
  const isCommunityPage = location.pathname.startsWith('/community');
  const isShopPage = location.pathname.startsWith('/shop');
  const isAdminPage = location.pathname.startsWith('/admin');



  return (
    <header className='Header'>
      <nav>
        <ul className='Header'>
          <li><Link to="/">Strona Główna</Link></li>
          {isAuthenticated ? (
            <>
            {isProfilePage ? (
              <>
                <li><Link to="/profile">Profil</Link></li>
                <li><Link to="/profile/level">Lewel</Link></li>
                <li><Link to="/profile/achievements">Osiągnięcia</Link></li>
                <li><Link to="/profile/statistics">Statystyka</Link></li>
              </>
            ) : (
              <li><Link to="/profile">Profil</Link></li>
            )}
            {isCommunityPage ? (
              <>  
                <li><Link to="/community">Społeczność</Link></li>
                <li><Link to="/community/friends">Znajomi</Link></li>
                <li><Link to="/community/organisations">Organizacje</Link></li>
                <li><Link to="/community/settings">Ustawienia społecznośći</Link></li>
              </>
            ) : (
              <li><Link to="/community">Społeczność</Link></li>
            )}
            
            {isShopPage ? (
              <>
              </>
            ) : (
              <li><Link to="/shop">Sklep</Link></li>
            )}
            
            {user?.isAdmin && (
              <>
              <li><Link to="/admin">Panel Administracyjny</Link></li>
              {isAdminPage &&  (
                <>
                  <li><Link to="/admin/organisations">Admin - Organizacje</Link></li>
                </>
              )}
              </>
            )}

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
