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