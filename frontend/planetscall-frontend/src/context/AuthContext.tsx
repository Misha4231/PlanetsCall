// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getUser, login as loginService, logout as logoutService, isAuthenticated } from '../services/authService';
import { getFullUser, getAddAttendance } from '../services/userService';


interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  money : number;
  level: number;
  achievements: string[];
  badges: string[];
  profile_image: string;
  description: string;
  points: number;
  theme_preference: number;
  last_login_at: string;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  isNotifiable: boolean;
  isVisible: boolean;
  instagramLink: string;
  linkedinLink: string;
  youtubeLink: string;
  cityId: number;
  countryId: number;
  mailsSubscribed: boolean;
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
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('authToken'));

  useEffect(() => {
    const storedToken = sessionStorage.getItem('authToken');
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