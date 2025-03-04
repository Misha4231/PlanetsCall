
import { authHeader }  from  "./authHeader";

export const getCategories = async (authToken: string) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items/categories`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) throw new Error('Nie udało się pobrać kategorii.');

  return await response.json();
};

//

export const getItemsByCategory = async (authToken: string, categoryId: number, page: number = 1) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items/${categoryId}?page=${page}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!response.ok) throw new Error('Nie udało się pobrać przedmiotów.');

  return await response.json();
};

//

export const buyItem = async (authToken: string, itemId: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Items/buy/${itemId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    
    const errorData = await response.json();
    console.log(errorData.error);
    console.log(errorData);
    throw new Error('Nie udało się kupić przedmiotu.');
  }

  return await response.json();
};

//

export const addCategory = async (authToken: string, title: string, image: string) => {
  console.log("Token: " + authToken);
  console.log("Tytul: " + title);
  console.log("Obraz: " + image);
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items/categories`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, image }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData.error);
    console.log(errorData);
    throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
  }

//console.log(await response.text());
// const text = await response.text();
// return text ? JSON.parse(text) : null;
return await response.json();
};

//

export const removeCategory = async (authToken: string) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items/categories`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
  }

  return await response.json();

};

//

export const addItems = async (authToken: string, categoryId: number, price: number, image: string, rarity: string, title: string) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}/api/Items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      categoryId,
      price,
      image,
      rarity,
      title
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();  
    throw new Error(errorData.message || 'Błąd logowania');
  }

  const data = await response.json();
};

//

export const removeItems = async (authToken: string) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}/api/Items`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();  
    throw new Error(errorData.message || 'Błąd logowania');
  }

  const data = await response.json();
};

//

export const updteItem = async (
  authToken: string,
  itemId: number,  
  categoryId: number,
  price: number,
  image: string,
  rarity: string,
  title: string
) => {

  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  
  const response = await fetch(`${authHeader()}api/Items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      categoryId, price, image, rarity, title
    }
    ),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData.error);
    console.log(errorData);
    throw new Error(errorData.message || 'Błąd aktualizacji itemu');
  }

  return await response.json();
};

//

export const updteCategory = async (
authToken: string,
categoryId: number,
title: string,
image: string,
) =>{

  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  
  const response = await fetch(`${authHeader()}api/Items/category/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      title, image
    }
    ),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData.error);
    console.log(errorData);
    throw new Error(errorData.message || 'Błąd aktualizacji kategorii');
  }

  return await response.json();
};