// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { getFullUser, getUser, login as loginService, logout as logoutService, isAuthenticated } from '../services/authService';


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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      getUser(token)
        .then(setUser)
        .catch(() => {
          setUser(null);
          setToken("");
        });
    }
  }, [token]);

  const login = async (uniqueIdentifier: string, password: string) => {
    try {
      const { token: newToken, user: userData } = await loginService(uniqueIdentifier, password);
      setToken(newToken);

      const fullUserData = await getFullUser(newToken);
      setUser(fullUserData);
    } catch (error) {
      throw new Error('Błąd logowania');
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{user, isAuthenticated: !!user, token, login, logout }}>
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