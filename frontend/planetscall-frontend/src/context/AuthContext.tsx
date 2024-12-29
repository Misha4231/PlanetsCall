// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getUser, login as loginService, logout as logoutService, isAuthenticated } from '../services/authService';


interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  money : number;
  level: number;
  achievements: string[];
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // if (isAuthenticated()) {
    //   getUser()
    //     .then(setUser)
    //     .catch(() => setUser(null));
    // }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginService(email, password);
      //const userData = await getUser();
      //setUser(userData);
    } catch (error) {
      throw new Error('Błąd logowania');
    }
  };

  const logout = () => {
    logoutService();
    //setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
