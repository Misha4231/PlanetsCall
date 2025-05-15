import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <ul>
                        <li><Link to="/profile">Profil</Link></li>
                        <li><Link to="/tasks">Zadania</Link></li>
                        <li><Link to="/community">Społeczność</Link></li>
                        <li><Link to="/auth/sign-in">Logowanie</Link></li>
                        <li><Link to="/auth/sign-up">Rejestracja</Link></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <p>© 2024 Planet's Call. Wszelkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;