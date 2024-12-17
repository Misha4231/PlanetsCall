export const login = async (email: string, password: string) => {
  const response = await fetch('https://api.aplikacja.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Błąd logowania');
  }

  const data = await response.json();
  localStorage.setItem('authToken', data.token);  
  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');  
};

export const getUser = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null; 
  }

  const response = await fetch('https://api.twoja-aplikacja.com/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać danych użytkownika');
  }

  return await response.json();
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};
