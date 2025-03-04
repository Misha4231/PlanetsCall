// AnOrganisation.tsx
import React, { useEffect, useState } from 'react';
import { getOrganisationData, getOrganisationUsers } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/shared/Header';
import Footer from '../../components/Footer/Footer';
import { tokenToString } from 'typescript';
import { Member } from './communityTypes';

const AnOrganisation = () => {
  const { user, isAuthenticated, token, loadingUser } = useAuth();
  const [organisation, setOrganisation] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if(token!=null){
      const fetchData = async () => {
  
        if (!organisationUniqueName) {
          setError('Organisation unique name is missing.');
          return;
        }

        try {
          setLoading(true);
          const orgData = await getOrganisationData(token, organisationUniqueName);
          setOrganisation(orgData);
          const userData = await getOrganisationUsers(token, organisationUniqueName);
          setUsers(userData);
          console.log(users);
          setError(null);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
    
  }, [token, organisationUniqueName]);

  if (loadingUser) {
    return <div>Ładowanie danych użytkownika...</div>;
  }  
  
  if (!isAuthenticated) {
    return (<div>
      <Header/>
      <p style={{ color: 'red' }}>Użytkownik nie jest zalogowany.</p>

    </div>);   
  }

  return (
    <div>
      <Header/>
      <section className="blockCode">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {organisation && (
          <div>
         <h2>Informacje o organizacji {organisation.name}</h2>
            <h3>{organisation.name}</h3>
            <p>{organisation.description}</p>
            <h4>Members</h4>
                {loading ? (
              <p>Ładowanie...</p>
            ) : users.length > 0 ? (
              <ul>
                {users.map(member => (
                  <li key={member.id}>{member.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p>            
                Nie należysz do żadnych organizacji.</p>
            )}
          </div>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default AnOrganisation;
