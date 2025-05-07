
import { authHeader, PaginationResponse }  from  "./headers";

export interface Items {
    "id": number, 
    "categoryId": number,
    "price": number,
    "image": string,
    "rarity": string,
    "title": string
}

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

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] || 'Nie udało się pobrać przedmiotów.');
  }

  const data = await response.json();
  console.log(data);


  
  return data.items ?? []; 
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
    console.log(errorData);
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd podczas usuwania kategorii.');
  }

  const data = await response;
  console.log(data);
  return true;
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
    console.log(errorData);
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd podczas usuwania kategorii.');
  }
  const data = await response;
  console.log(data);
// const text = await response.text();
// return text ? JSON.parse(text) : null;
return true;
};

//

export const removeCategory = async (authToken: string, categoryId: number) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });


  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData);
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd podczas usuwania kategorii.');
  }

  return true;

};

//

export const addItems = async (authToken: string, formData: any) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData);
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd logowania');
  }

  return true;
};

//

export const removeItems = async (authToken: string, itemId: number) => {
  if (!authToken) throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');

  const response = await fetch(`${authHeader()}api/Items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData);
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd logowania');
  }

  return true;
};

//

export const updateItem = async (
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
    console.log(errorData);
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd aktualizacji itemu');
  }

  return true;
};

//

export const updateCategory = async (
authToken: string,
categoryId: number,
title: string,
image: string,
) =>{

  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  
  const response = await fetch(`${authHeader()}api/Items/categories/${categoryId}`, {
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
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||'Błąd aktualizacji kategorii');
  }

  return true;
};


export const getUserItems  = async (authToken: string, categoryId: number, page: number): Promise<PaginationResponse<Items>> => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }
  const response = await fetch(`${authHeader()}api/Items/my-items?categoryId=${categoryId}&?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] || 'Nie udało się pobrać itemów');
  }

  const data = await response.json();
  console.log(data);

  return data;
};