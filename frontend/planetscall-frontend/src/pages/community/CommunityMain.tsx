//{/*Wyszukiwarka Organizacja, mozliwosc dolaczenia*/}
import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { getAnotherOrganisationJoin, getOrganisationRequests, getOrganisationUsers, searchOrganisations } from '../../services/communityService';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { Member, Organisation, OrganisationsResponse } from './communityTypes';
import { Link, useNavigate } from 'react-router-dom';

const CommunityMain = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [myOrganisations, setMyOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [membershipStatus, setMembershipStatus] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [sendRequest, setSendRequest] = useState<boolean>(false);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  
  useEffect(() => {
    if (myOrganisations.length > 0) {
      myOrganisations.forEach((org) => {
        checkMembership(org.uniqueName);
      });
    }
  }, [myOrganisations]);

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
  const handleJoinOrganisation = async (organisationUniqueName: string, isPrivate: boolean) => {
    if (!isAuthenticated || !token) return;
  
    try {
      if(await getAnotherOrganisationJoin(token, organisationUniqueName)){
        if (isPrivate) {    
          setSendRequest(true);    
          alert('Prośba o dołączenie została wysłana.');
        } else {
          alert('Dołączono do organizacji.');
        }
      } else{
        setSendRequest(true);
        alert('Już wysłałeś prośbę');
      }

      checkMembership(organisationUniqueName);
    } catch (err) {
      console.log('Błąd podczas dołączania do organizacji:', err);
    }
  };

  const checkMembership = async (organisationUniqueName: string) => {
    if (!isAuthenticated || !token) return false;
  
    try {
      const members = await getOrganisationUsers(token, organisationUniqueName);
      const isMember = members.some((member: Member) => member.id === user?.id);
      setMembershipStatus((prev) => ({ ...prev, [organisationUniqueName]: isMember }));
      return isMember;
    } catch (err) {
      console.error('Błąd podczas sprawdzania członkostwa:', err);
      return false;
    }
  };
  


  return (
    <div className="app-container">
      <Header/>

        
        <section className="blockCode">
      {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <>
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
          { myOrganisations.length > 0 ? (
            <ul>
              {myOrganisations.map((org) => {
                const isMember = membershipStatus[org.uniqueName] || false;

                {/* Informacja, czy uzytkownik jest w organizacji, jesli nie ma mozliwosc dolaczenia lub wyslania prosby w zalezosni od prywatnosci organizacji */}
                return (
                  <li key={org.uniqueName}>
                    <h3>{org.name}</h3>
                    <Link to={`/community/organisation/${org.uniqueName}`}>{org.uniqueName}</Link>
                    <p>{org.description}</p>
                    <img src={org.organizationLogo} alt={`Logo ${org.name}`} style={{ width: '100px', height: '100px' }} />
                    <p>{org.isPrivate ? 'Prywatna' : 'Publiczna'}</p>
                    <p>Minimalny poziom dołączenia: {org.minimumJoinLevel}</p>

                    {isMember ? (
                      <p>Jesteś już członkiem tej organizacji.</p>
                    ) : (
                      <div>
                        {org.isPrivate ? (sendRequest ? 'Wysłano już prośbę' : <button onClick={() => handleJoinOrganisation(org.uniqueName, org.isPrivate)}>Wyślij prośbę o dołączenie</button>) : 'Dołącz do organizacji'}
                      

                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Nie znaleziono żadnej organizacji</p>
          )}
          </>
        )}
        </section>

      <Footer/>
      
    </div>
  )
}

export default CommunityMain
