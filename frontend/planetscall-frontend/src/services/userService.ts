import { authHeader }  from  "./headers";

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
  //console.log(data);
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
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd rejestracji');
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
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||'Nie udało się pobrać danych użytkownika');
  }

  return true;
};


export const getUserAttendance  = async (authToken: string, username: string) => {
  console.log(username);
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }
  
  const response = await fetch(`${authHeader()}api/Profiles/${username}/attendance`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||'Nie udało się pobrać danych użytkownika');
  }

  const data = await response.json();
  console.log(data);
  return data;
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

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] || 'Nie udało się pobrać danych użytkownika');
  }

  const data = await response.json();
  //console.log(data);

  return data;
};





export const getUserSelectedItems  = async (authToken: string, categoryId: number, page: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }
  const response = await fetch(`${authHeader()}api/SelectedItems?categoryId=${categoryId}&?page=${page}`, {
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
  //console.log(data);

  return data;
};



export const addSelectedItem = async (authToken: string,  itemId: number) => {
  if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
    
  
    const response = await fetch(`${authHeader()}api/SelectedItems/${itemId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    });

    if (!response.ok) {
      const errorData = await response.json();  
      console.log(errorData)
      throw new Error(errorData.errors.CustomValidation[0] || 'Nie udało się dodać itemu');
    }
  
    //console.log(username);
    
    return true;
}


export const deleteSelectedItem = async (authToken: string,  itemId: number) => {
  if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/SelectedItems/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();  
      console.log(errorData)
      throw new Error(errorData.errors.CustomValidation[0] || 'Nie udało się zdjąć itemu');
    }
    // const data = await response.json();

    // if (!response.ok ) {
    //   const errorText = await response.text();
    //   //console.log("BladR: " + errorText);
    //   throw new Error('Nie udało się usunąć znajomego');
    // }
  
    return  true;


}