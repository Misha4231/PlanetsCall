import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { searchOrganisations } from '../../services/communityService';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Organisation, OrganisationsResponse } from './communityTypes';
import { useNavigate } from 'react-router-dom';

const CommunityMain = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [myOrganisations, setMyOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  if (loading) {
    return <div>Ładowanie danych użytkownika...</div>;
  }  
  
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>

    </div>);   
  }

  const handleSearch = async () => {
    if (!isAuthenticated || !token || !searchPhrase.trim()) return;

    try {
      setLoading(true);
      const response: OrganisationsResponse = await searchOrganisations(token, searchPhrase, pagination.pageIndex);
      setMyOrganisations(response.items);
      setPagination({
        pageIndex: response.pageIndex,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header/>

        
        <section className="blockCode">
          <h3>Organizacje</h3>

          {/* Pole tekstowe do wprowadzenia frazy wyszukiwania */}
          <input
            type="text"
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            placeholder="Wpisz frazę wyszukiwania"
          />

          {/* Przycisk do wysłania zapytania */}
          <button onClick={handleSearch} disabled={!searchPhrase.trim()}>
            Szukaj
          </button>

          {/* Komunikat w razie błędu */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Lista organizacji przy użyciu słowa-frazy */}
          {loading ? (
            <p>Ładowanie...</p>
          ) : myOrganisations.length > 0 ? (
            <ul>
              {myOrganisations.map((org) => (
                <li key={org.uniqueName}>
                  <h3>{org.name}</h3>
                  <p>{org.description}</p>
                  <img src={org.organizationLogo} alt={`Logo ${org.name}`} style={{ width: '100px', height: '100px' }} />
                  <p>{org.isPrivate ? 'Prywatna' : 'Publiczna'}</p>
                  <p>Minimalny poziom dołączenia: {org.minimumJoinLevel}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nie znaleziono żadnej organizacji</p>
          )}
        </section>

      <Footer/>
      
    </div>
  )
}

export default CommunityMain
