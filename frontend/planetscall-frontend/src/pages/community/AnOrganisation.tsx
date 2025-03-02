// AnOrganisation.tsx
import React, { useEffect, useState } from 'react';
import { getOrganisationSettings, getOrganisationUsers } from '../../services/communityService';

const AnOrganisation = ({ authToken, organisationUniqueName }: { authToken: string; organisationUniqueName: string }) => {
  const [organisation, setOrganisation] = useState<any>(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await getOrganisationSettings(authToken, organisationUniqueName);
        setOrganisation(orgData);
        const userData = await getOrganisationUsers(authToken, organisationUniqueName);
        setUsers(userData);
      } catch (err) {
        setError('Failed to load organisation data.');
      }
    };
    fetchData();
  }, [authToken, organisationUniqueName]);

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
