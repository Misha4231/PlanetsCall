import { authHeader }  from  "./authHeader";

export const getUser  = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Auth/me/min`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error('Brak autoryzacji. Proszę się zalogować.');
  }
  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych użytkownika');
  }

  return await response.json();
};

export const getFullUser = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Auth/me/full`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error('Brak autoryzacji. Proszę się zalogować.');
  }
  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych użytkownika');
  }

  const data = await response.json();
  //console.log("Dane " + data);
  const d = data.isAdmin;
  //console.log(d);

  
  return await data;
  
};

export const updateUserSettings = async (authToken: string, userId: number, formData: any) => {
  //console.log("Token: " + authToken);

  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  
  const response = await fetch(`${authHeader()}api/Profiles/${userId}/set-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData.error);
    console.log(errorData);
    throw new Error(errorData.message || 'Błąd aktualizacji profilu');
  }

  return await response.json();
};


export const getBadge = async (authToken: string, formData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Profiles/set-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Błąd aktualizacji profilu');
  }

  return await response.json();
};



export const getAddAttendance  = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Profiles/add-attendance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych użytkownika');
  }

  return await response.json();
};


export const getAnotherUser  = async (authToken: string, anotherUser : string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Profiles/${anotherUser}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status === 401) {
    throw new Error('Brak autoryzacji. Proszę się zalogować.');
  }
  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych użytkownika');
  }

  return await response.json();
};

