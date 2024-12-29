export const login = async (uniqueIdentifier: string, password: string) => {
  const response = await fetch('https://localhost:7000/api/Auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uniqueIdentifier, 
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();  
    throw new Error(errorData.message || 'Błąd logowania');
  }

  const data = await response.json();
  console.log(data);
  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');  
};

export const getUser = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch('https://localhost:7000/api/Auth/me/min', {
    headers: {
      'Authorization': `Bearer ${token}`,
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

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};
