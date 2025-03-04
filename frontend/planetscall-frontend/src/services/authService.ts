import { error } from "console";
import { authHeader }  from  "./authHeader";
let token = "";

export const login = async (uniqueIdentifier: string, password: string) => {
  const response = await fetch(`${authHeader()}api/Auth/sign-in`, {
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
  token = data.accessToken;
  console.log(token);
  return {token, user: data.user};
};

export const logout = () => {
  token = "";  
};

export const getUser = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Auth/me/min`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
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
  return !!token;
};


