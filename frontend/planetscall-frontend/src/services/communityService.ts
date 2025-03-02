/*Podzial

  - FRIENDS,
  - ORGANISATIONS
  - ORGANISATIONROLES

*/

//FRIENDS

export const getFriends = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Friends`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy znajomych.');
  }

  const data = await response.json();
  console.log('API zwróciło:', data);

  return data.items ?? []; 
};

export const addFriend = async (authToken: string,  username: string) => {
  if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`https://localhost:7000/api/community/Friends/${username}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (response.status === 401) {
      throw new Error('Błąd podczas dodawania znajomego:.');
    }
    if (!response.ok) {
      throw new Error('Nie udało się dodać znajomego');
    }
  
    return await response.json();


}


export const removeFriend = async (authToken: string,  username: string) => {
  if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`https://localhost:7000/api/community/Friends/${username}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (response.status === 401) {
      throw new Error('Brak autoryzacji. Proszę się zalogować.');
    }
    if (!response.ok) {
      throw new Error('Nie udało się usunąć znajomego');
    }
  
    return await response.json();


}


//Organisations

export const getMyOrganisations = async (authToken: string, page: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  console.log(page);
  const response = await fetch(`https://localhost:7000/api/community/Organisations/my?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać twojej listy organizacji.');
  }

  const data = await response.json();
  console.log('API zwróciło:', data);

  return data;
};

export const getAnotherOrganisationJoin = async (authToken: string, organisationUniqueName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }
  
  const response = await fetch(`https://localhost:7000//api/community/Organisations/join/${organisationUniqueName}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy organizacji do dołączenia.');
  }

  const data = await response.json();
  console.log('API zwróciło:', data);

  return data;
};

export const createOrganisation = async (authToken: string, organisationData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(organisationData),
  });

  if (!response.ok) {
    throw new Error('Nie udało się utworzyć organizacji.');
  }

  return await response.json();
};

export const getOrganisationRequests = async (authToken: string, organisationUniqueName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/${organisationUniqueName}/requests`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy próśb o dołączenie.');
  }

  return await response.json();
};

export const acceptOrganisationRequest = async (authToken: string, organisationUniqueName: string, userId: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/${organisationUniqueName}/requests/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się zaakceptować prośby o dołączenie.');
  }

  return await response.json();
};

export const rejectOrganisationRequest = async (authToken: string, organisationUniqueName: string, userId: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/${organisationUniqueName}/requests/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się odrzucić prośby o dołączenie.');
  }

  return await response.json();
};

export const getOrganisationUsers = async (authToken: string, organisationUniqueName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/${organisationUniqueName}/users`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy użytkowników organizacji.');
  }

  return await response.json();
};

export const removeOrganisationUser = async (authToken: string, organisationUniqueName: string, userId: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/${organisationUniqueName}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się usunąć użytkownika z organizacji.');
  }

  return await response.json();
};

export const searchOrganisations = async (authToken: string, searchPhrase: string, page = 1) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/search/${searchPhrase}?page=${page}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się wyszukać organizacji.');
  }

  return await response.json();
};

export const getOrganisationSettings = async (authToken: string, organisationUniqueName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/settings/${organisationUniqueName}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać ustawień organizacji.');
  }

  return await response.json();
};

export const updateOrganisationSettings = async (authToken: string, organisationUniqueName: string, settingsData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/settings/${organisationUniqueName}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(settingsData),
  });

  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować ustawień organizacji.');
  }

  return await response.json();
};

export const deleteOrganisation = async (authToken: string, organisationUniqueName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/Organisations/${organisationUniqueName}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się usunąć organizacji.');
  }

  return await response.json();
};


//OrganisationRoles


export const getOrganisationRoles = async (authToken: string, organisationName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/organisations/${organisationName}/roles`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać ról organizacji.');
  }

  return await response.json();
};

export const createOrganisationRole = async (authToken: string, organisationName: string, roleData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/organisations/${organisationName}/roles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  if (!response.ok) {
    throw new Error('Nie udało się utworzyć roli w organizacji.');
  }

  return await response.json();
};

export const updateOrganisationRole = async (authToken: string, organisationName: string, roleId: number, roleData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/organisations/${organisationName}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roleData),
  });

  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować roli w organizacji.');
  }

  return await response.json();
};

export const deleteOrganisationRole = async (authToken: string, organisationName: string, roleId: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/organisations/${organisationName}/roles/${roleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się usunąć roli w organizacji.');
  }

  return await response.json();
};

export const grantOrganisationRole = async (authToken: string, organisationName: string, roleId: number, userId: number ) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/organisations/${organisationName}/roles/${roleId}/grant/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się nadać roli użytkownikowi.');
  }

  return await response.json();
};

export const revokeOrganisationRole = async (authToken: string, organisationName: string, roleId: number, userId: number ) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`https://localhost:7000/api/community/organisations/${organisationName}/roles/${roleId}/revoke/${userId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się odebrać roli użytkownikowi.');
  }

  return await response.json();
};
