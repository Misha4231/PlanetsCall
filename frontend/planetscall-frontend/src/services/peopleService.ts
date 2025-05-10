
import { User } from "../context/AuthContext";
import { authHeader }  from  "./headers";

export interface Users {
    items: UserProfile[];
    pageIndex: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  isActivated: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  firstName: string;
  lastName: string;
  points: number;
  progress: number;
  profileImage?: string;
  preferredLanguage: string;
  status?: string;
}



export const searchUsers = async (authToken: string, searchPhrase: string = '', page: number = 1) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }
  //searchPhrase = "zielony";
  const response = await fetch(`${authHeader()}api/Profiles/search/${searchPhrase}?page=${page}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json-patch+json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();  
    throw new Error(errorData.errors.CustomValidation[0] || 'Nie udało się wyszukać organizacji.');
  }  

  const data = await response.json();

  //console.log(response);
  return data;
};