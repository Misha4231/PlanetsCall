import React, { useState } from 'react'
import Header from '../../components/shared/Header'
import { useAuth } from '../../context/AuthContext';
import { createOrganisation } from '../../services/communityService';
import { Link } from 'react-router-dom';


const FindOrganisation = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  return (
    <div>
      <Header />
      <section className="codeBlock">
        
                <h3>Znajdź Organizacje</h3>
                <ul>
                  <li><Link to="/community/organisations">Twoje Organizacje</Link></li>
                  <li><Link to="/community/organisations/create">Stwórz Organizacje</Link></li>
                </ul>
        
                {/* Komunikat w razie błędu */}
                {error && <p style={{ color: 'red' }}>{error}</p>}
        
      </section>
    </div>
  )
}

export default FindOrganisation
