export const getCategories = async (authToken: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch('https://localhost:7000/api/Items/categories', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się pobrać kategorii.');
    }
  
    const data = await response.json();
    return data.items ?? [];
  };
  
  export const getItemsByCategory = async (authToken: string, categoryId: number, page: number) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`https://localhost:7000/api/Items/${categoryId}?page=${page}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się pobrać przedmiotów.');
    }
  
    const data = await response.json();
    return data.items ?? [];
  };
  
  export const buyItem = async (authToken: string, itemId: number) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`https://localhost:7000/api/Items/buy/${itemId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się kupić przedmiotu.');
    }
  
    return await response.json();
  };
  
  export const addCategory = async (authToken: string, categoryName: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch('https://localhost:7000/api/Items/categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: categoryName }),
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się dodać kategorii.');
    }
  
    return await response.json();
  };
  