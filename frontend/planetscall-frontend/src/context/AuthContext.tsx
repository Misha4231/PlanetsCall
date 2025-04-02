// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getUser, login as loginService, logout as logoutService, isAuthenticated } from '../services/authService';
import { getFullUser, getAddAttendance } from '../services/userService';


export type ThemeType = 0 | 1 | 2;

export interface User {
  id: number;
  email: string;
  username: string;
  accountType: string; 
  isActivated: boolean;
  isBlocked: boolean;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  points: number;
  progress: number;
  profileImage?: string;
  createdAt: Date ;
  updatedAt: Date ;
  lastLogin?: Date; 
  isAdmin: boolean;
  preferredLanguage: string;
  isNotifiable: boolean;
  isVisible: boolean;
  description?: string;
  status?: string;
  instagramLink?: string;
  linkedinLink?: string;
  youtubeLink?: string; 
  cityId?: number;
  city?: { 
    id: number;
    name: string;
  };
  countryId?: number;
  country?: { 
    id: number;
    name: string;
  };
  mailsSubscribed: boolean;
  themePreference: ThemeType; 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  loadingUser : boolean | false;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoading] = useState(true);
  //const [token, setToken] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('authToken'));

  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
    //const storedToken = token;
    //console.log(storedToken);
    if (storedToken) {
      setLoading(true);
      getUser(storedToken)
        .then(basicUser => {
          setUser(basicUser);
          return getFullUser(storedToken);
        })
        .then(fullUser => {
          setUser(fullUser);
        })
        .finally(() => {
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          sessionStorage.removeItem('authToken');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (uniqueIdentifier: string, password: string) => {
    try {
      const { token: newToken, user: userData } = await loginService(uniqueIdentifier, password);
      sessionStorage.setItem('authToken', newToken);
      setToken(newToken);

      const fullUserData = await getFullUser(newToken);
      setUser(fullUserData);
    } catch (error) {
      throw new Error('Błąd logowania');
    }
  };

  const logout = () => {
    logoutService();
    sessionStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{user, isAuthenticated: !!user, token, login, logout, loadingUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};