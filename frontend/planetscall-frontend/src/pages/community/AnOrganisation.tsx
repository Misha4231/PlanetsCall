// AnOrganisation.tsx
import React, { useEffect, useState } from 'react';
import { getOrganisationSettings, getOrganisationUsers } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const AnOrganisation = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [organisation, setOrganisation] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { organisationUniqueName } = useParams<{ organisationUniqueName: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await getOrganisationSettings(token, organisationUniqueName);
        setOrganisation(orgData);
        const userData = await getOrganisationUsers(token, organisationUniqueName);
        setUsers(userData);
      } catch (err) {
        setError('Failed to load organisation data.');
      }
    };
    fetchData();
  }, [token, organisationUniqueName]);

  return (
    <div>
      <h2>Organisation Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {organisation && (
        <div>
          <h3>{organisation.name}</h3>
          <p>{organisation.description}</p>
          <h4>Members</h4>
          <ul>
            {users.map((user: any) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnOrganisation;
