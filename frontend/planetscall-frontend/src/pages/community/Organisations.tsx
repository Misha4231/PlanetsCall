//{/*Organmizacje użytkownika*/}
import React, { useEffect, useState } from 'react';
import Header from '../../components/shared/Header';
import { useAuth } from '../../context/AuthContext';
import { getMyOrganisations } from '../../services/communityService';
import { Link } from 'react-router-dom';
import { Organisation, OrganisationsResponse } from './communityTypes';
import Footer from '../../components/Footer/Footer';

const Organisations: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [myOrganisations, setMyOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const fetchMyOrganisations = async () => {
      try {
        setLoading(true);
        const response: OrganisationsResponse = await getMyOrganisations(token, pagination.pageIndex);
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

    fetchMyOrganisations();
  }, [isAuthenticated, token, pagination.pageIndex]); 

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  };

  //console.log(myOrganisations);

  return (
    <div>
      <Header />
      <section className="blockCode">
        <h3>Twoje Organizacje</h3>
        <ul>
          <li><Link to="/community/organisations/create">Stwórz Organizacje</Link></li>
          <li><Link to="/community/">Znajdź Organizacje</Link></li>
        </ul>

        {/* Komunikat w razie błędu */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Lista organizacji użytkownika */}
          {loading ? (
          <p>Ładowanie...</p>
        ) : myOrganisations.length > 0 ? (
          <ul>
            {myOrganisations.map(org => (
              <li key={org.uniqueName}>
                 <Link to={`/community/organisation/${org.uniqueName}`}>{org.uniqueName}</Link>
                <h3>{org.name}</h3>
                <p>{org.description}</p>
                <img src={org.organizationLogo} alt={`Logo ${org.name}`} style={{ width: '100px', height: '100px' }} />
                <p>{org.isPrivate ? 'Prywatna' : 'Publiczna'}</p>
                <p>Minimalny poziom dołączenia: {org.minimumJoinLevel}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>            
            Nie należysz do żadnych organizacji.</p>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default Organisations;