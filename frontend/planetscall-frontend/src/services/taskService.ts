import { TaskType } from './adminOrgService';
import { authHeader } from './authHeader'; 

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  createdAt: Date;
  type: TaskType;
  isGroup: boolean;
  isActive: boolean;
}

export interface CompletedTask extends Task {
  completionDate: Date;
  proofUrl: string;
}


export const getTasks = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy zadań.');
  }

  const data = await response.json();
  return data;
};


export const getTaskById = async (authToken: string, taskId: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Nie udało się pobrać zadania o ID: ${taskId}.`);
  }

  const data = await response.json();
  return data;
};


export const uploadTaskProof = async (authToken: string, taskId: string, file: File) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${authHeader()}api/Tasks/${taskId}/upload-proof`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Nie udało się przesłać dowodu wykonania zadania o ID: ${taskId}.`);
  }

  const data = await response.json();
  return data;
};


export const getCompletedTasks = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Tasks/completed-tasks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Nie udało się pobrać listy wykonanych zadań.');
  }

  const data = await response.json();
  return data;
};