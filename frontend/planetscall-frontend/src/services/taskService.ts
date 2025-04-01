import { authHeader }  from  "./authHeader";

export const d = async (authToken: string, page: number, ) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/users?page=${page}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error('Nie udało się pobrać listy użytkowników.');
    }
  
    return data; 
  };