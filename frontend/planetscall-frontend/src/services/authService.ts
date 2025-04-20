import { error } from "console";
import { authHeader }  from  "./authHeader";
let token = "";

export const signUpUser = async (username: string, email: string, password: string, passwordConfirmation: string, agreedToTermsOfService: boolean): Promise<string> => {
  const response = await fetch(`${authHeader()}api/Auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      username,
      passwords: {
        password,
        passwordConfirmation,
      },
      agreedToTermsOfService,
    }),
  });

  console.log(response)
  if (!response.ok) {
    const errorData = await response.json();  
    console.log(errorData)
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd rejestracji');
  }

  return "";
};

export const activationAccount = async (activationCode: string): Promise<string> => {
  const response = await fetch(`${authHeader()}api/Auth/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: activationCode }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Szczegóły błędu:', errorData); 
        throw new Error(errorData.message || 'Błąd aktywacji konta');
      }


  if (!response.ok) {
    const errorData = await response.json();  
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd aktywacji');
  }

  

  const data = await response.json();
  console.log(data + "\n");
  console.log(response);

  return "";
};


export const login = async (uniqueIdentifier: string, password: string) => {
  const response = await fetch(`${authHeader()}api/Auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uniqueIdentifier, 
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();  
    throw new Error(errorData.errors.CustomValidation[0] || 'Błąd logowania');
  }
  
  const data = await response.json();
  //console.log("Dane " + data);
  token = data.accessToken;
  //console.log(token);
  return {token, user: data.user};
};

export const logout = () => {
  token = "";  
};

export const getUser = async (authToken: string) => {
  if (!authToken) {
    throw new Error('Brak tokenu. Użytkownik nie jest zalogowany.');
  }

  const response = await fetch(`${authHeader()}api/Auth/me/min`, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
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

export const isAuthenticated = () => {
  return !!token;
};