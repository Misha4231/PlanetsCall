import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='header-container'>
      <nav>
        <div className='hamburger-menu' onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </div>
        <ul className={`main-nav ${isMobileMenuOpen ? 'show' : ''}`}>
          <li className="nav-item"><Link to="/">Strona Główna</Link></li>
          
          {isAuthenticated && (
            <>
              <li 
                className="nav-item dropdown"
                onClick={() => toggleDropdown('profile')}
              >
                <Link to="/profile">Profil</Link>
                <ul className={`dropdown-menu ${activeDropdown === 'profile' ? 'show' : ''}`}>
                  <li><Link to={`/profile/${user?.username}/statistics`}>Statystyka</Link></li>
                  <li><Link to={`/profile/ecorus`}>Ecorus</Link></li>
                  <li><Link to="/profile/settings">Ustawienia</Link></li>
                </ul>
              </li>
              <li 
                className="nav-item dropdown"
                onClick={() => toggleDropdown('community')}
              >
                <Link to="/community">Społeczność</Link>
                <ul className={`dropdown-menu ${activeDropdown === 'community' ? 'show' : ''}`}>
                  <li><Link to="/community/users">Użytkownicy</Link></li>
                  <li><Link to="/community/friends">Znajomi</Link></li>
                  <li><Link to="/community/organisations/search">Organizacje</Link></li>
                  <li><Link to="/community/organisations">Moje Organizacje</Link></li>
                </ul>
              </li>

              <li 
                className="nav-item dropdown"
                onClick={() => toggleDropdown('task')}
              ><Link to="/tasks">Zadania</Link>
                {((user?.progress ? user.progress : 0) >= 5 || user?.isAdmin) && (
                  <ul className={`dropdown-menu ${activeDropdown === 'task' ? 'show' : ''}`}>
                    <li><Link to="/admin/task/overwatch">Sprawdzaj zadania</Link></li>
                  </ul>
                )}
              </li>
              
              <li className="nav-item"><Link to="/shop">Sklep</Link></li>
              
              {user?.isAdmin && (
                <li 
                  className="nav-item dropdown"
                onClick={() => toggleDropdown('admin')}
                >
                  <Link to="/admin">Panel Administracyjny</Link>
                  <ul className={`dropdown-menu ${activeDropdown === 'admin' ? 'show' : ''}`}>
                    <li><Link to="/admin/organisations">Organizacje</Link></li>
                    <li><Link to="/admin/users">Użytkownicy</Link></li>
                    <li><Link to="/admin/tasks">Zadania</Link></li>
                    <li><Link to="/admin/shop">Sklep</Link></li>
                  </ul>
                </li>
              )}

              <li className="nav-item">
                <Link to="/"><button className="logout-btn" onClick={logout}>Wyloguj</button></Link>
              </li>
            </>
          )}
          
          {!isAuthenticated && (
            <>
              <li className="nav-item"><Link to="/auth/sign-in">Zaloguj się</Link></li>
              <li className="nav-item"><Link to="/auth/sign-up">Zajerestruj się</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
