import exp from 'constants';
import { TaskType } from './adminOrgService';
import { authHeader, PaginationResponse } from './headers'; 
import { AnotherUser, User } from '../types/userTypes';

export interface Task {
  id: number;
  title: string;
  description: string;
  reward: number;
  createdAt: Date;
  type: TaskType;
  isGroup: boolean;
  author: AnotherUser;
  isActive: boolean;
  organisation: boolean | null;
}

export interface CompletedTask extends Task {
  completionDate: Date;
  proofUrl: string;
}

export interface OverwatchTaskItem {
  checkedAt: Date;
  completedAt: Date;
  executor: AnotherUser;
  executorId:number;
  id:number;
  insector: AnotherUser | null;
  insectorId: number | null;
  isApproved: boolean;
  message: string;
  proof: string;
  task: Task;
  taskId:number;
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
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||'Nie udało się pobrać listy zadań.');
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
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||
    `Nie udało się pobrać zadania o ID: ${taskId}.`);
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
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||
    `Nie udało się przesłać dowodu wykonania zadania o ID: ${taskId}.`);
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
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||
    'Nie udało się pobrać listy wykonanych zadań.');
  }

  const data = await response.json();
  return data;
};





//Overwatch






export const addOverwatchReaction = async (authToken: string, formData: any) => {
  if (!authToken) {
     throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Overwatch/reaction`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||
    `Nie udało się wysłać reakcji na wykonanie zadania.`);
  }

  const data = await response.json();
  return data;
};

export const getOverwatchFeed = async (authToken: string, page: number): Promise<PaginationResponse<OverwatchTaskItem>> => {
  if (!authToken) {
     throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Overwatch/feed?page=${page}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||
    'Nie udało się pobrać listy żądan werifikacji zadań.');
  }



  const data = await response.json();
  //console.log(data);
  return data;
};

export const getOverwatchSpecificFeed = async (authToken: string, verificationId: number) => {
  if (!authToken) {
     throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Overwatch/feed/${verificationId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] ||
      'Nie udało się pobrać wybranego żądania werifikacji zadania.');
  }

  const data = await response.json();
  //return data;
  return data;
};

