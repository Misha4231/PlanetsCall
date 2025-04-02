import { authHeader }  from  "./authHeader";

/*
  - VERIFICATIONS
  - TASKS

*/

export type TaskType = 1 | 2 | 3;

export interface TaskTemplate {
  id: number;
  title: string;
  description: string;
  createAt: Date;
  reward: number;
  type: TaskType;
  isGroup: boolean;
  isActive: boolean;
}

export interface TaskTemplateUpdate {
  title: string;
  description: string;
  reward: number;
  type: TaskType;
  isGroup: boolean;
}


// VERIFICATIONS
export const getOrganisationVerifications = async (authToken: string ) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
  
    const response = await fetch(`${authHeader()}api/admin/organisations/Verification/`, {
    method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
  
    if (!response.ok) {
      throw new Error('Nie udało się pobrać listy organizacji do weryfikacji.');
    }
  
  
    const data = await response.json();
  
    return data;

  };

  export const sentResponseToOrganisationVerification = async (authToken: string, organisationUniqueName: string, action:string) => {
    if (!authToken) {
      throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
    }
    
  
    const response = await fetch(`${authHeader()}api/admin/organisations/Verification/${organisationUniqueName}/${action}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Nie udało wysłać żądania.');
    }
  
    const data = await response.json();
  
    return data;
  };



// TASKS


export const createTemplateTask = async (authToken: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/template-task`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json-patch+json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error('Nie udało się utworzyć szablonu zadania.');
  }

  const data = await response;
  console.log(data);
  return await true;
};

export const getAllTemplateTasks = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/template-task`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy szablonów zadań.');
  }

  const data = await response.json();
  
  return data;
};

export const getTemplateTaskById = async (authToken: string, id: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/template-task/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać szablonu zadania o ID: ${id}.`);
  }

  
  const data = await response.json();
  
  return data;
};

export const updateTemplateTask = async (authToken: string, id: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/template-task/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Nie udało się zaktualizować szablonu zadania o ID: ${id}.`);
  }

  
  const data = await response.json();
  
  return data;
};

export const deleteTemplateTask = async (authToken: string, id: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/template-task/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się usunąć szablonu zadania o ID: ${id}.`);
  }

    
  return true;
};

export const activateTemplateTask = async (authToken: string, id: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/template-task/${id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się aktywować szablonu zadania o ID: ${id}.`);
  }

  
  const data = await response;
  console.log(data)
  const d = data.json();
  return d;
};

export const getOrganizationTasks = async (authToken: string, organizationName: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/organization-task/${organizationName}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać zadań dla organizacji: ${organizationName}.`);
  }

  
  const data = await response.json();
  
  return data;
};

export const deleteOrganizationTask = async (authToken: string, organizationName: string, id: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/organization-task/${organizationName}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się usunąć zadania o ID: ${id} dla organizacji: ${organizationName}.`);
  }

  
  
  return true;
};

export const createOrganizationTask = async (authToken: string, organizationName: string, taskData: any) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/organisation-task/${organizationName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Nie udało się utworzyć zadania dla organizacji: ${organizationName}.`);
  }

  
  const data = await response.json();
  
  return data;
};

export const activateOrganizationTask = async (authToken: string, organizationName: string, id: number) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/TasksAdministration/organisation-task/${organizationName}/${id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się aktywować zadania o ID: ${id} dla organizacji: ${organizationName}.`);
  }

  
  const data = await response.json();
  
  return data;
};