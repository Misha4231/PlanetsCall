import { authHeader }  from  "./headers";

export const getUsersAdmin = async (authToken: string, page: number ) => {
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
  
    console.log(data);

    return data; 
  };

  export const blockUserAdmin = async (authToken: string, username: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/users/block/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się zablokować użytkownika.');
    }
  
    return true;
  };


  export const unblockUserAdmin = async (authToken: string, username: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/users/unblock/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się odblokować użytkownika.');
    }
  
    return true; 
  };


  export const resetUserAdmin = async (authToken: string, username: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/users/reset/${username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało się zresetować hasła użytkownika.');
    }
  
    return true;
  };



  export const getOrganisationsForVerificationAdmin = async (authToken: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/admin/organisations/Verification`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error('Nie udało się pobrać listy organizacji do weryfikacji.');
    }
  
    return data; 
  };


  export const verifyOrganisationAdmin = async (authToken: string, organisationName: string, action: string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(
      `${authHeader()}api/admin/organisations/Verification/${organisationName}/${action}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error('Nie udało się wykonać akcji weryfikacyjnej.');
    }
  
    return true; 
  };


//TASKS



export const getListOfTask = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }
  
  const response = await fetch(`${authHeader()}api/Tasks/template-task`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy zadań.');
  }

  //console.log('API zwróciło:', data);

  return data.items ?? []; 
};

export const createTask = async (authToken: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/template-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się utworzyć zadania.');
  }

  return data;
};

export const getTaskById = async (authToken: string, taskId: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/template-task/${taskId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się pobrać zadania.');
  }

  return data;
};


export const updateTask = async (authToken: string, taskId: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/template-task/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować zadania.');
  }

  return data;
};



export const deleteTask = async (authToken: string, taskId: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/template-task/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się usunąć zadania.');
  }

  return true;
};




export const getOrganizationTasks = async (authToken: string, organizationName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/organization-task/${organizationName}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się pobrać zadań organizacji.');
  }

  return data.items ?? [];
};



export const deleteOrganizationTask = async (authToken: string, organizationName: string, taskId: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/organization-task/${organizationName}/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się usunąć zadania organizacji.');
  }

  return true; 
};



export const createOrganizationTask = async (authToken: string, organizationName: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/organisation-task/${organizationName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się utworzyć zadania organizacji.');
  }

  return data;
};



export const updateOrganizationTask = async (authToken: string, organizationName: string, taskId: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/organisation-task/${organizationName}/${taskId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Nie udało się zaktualizować zadania organizacji.');
  }

  return data;
};