import React, { createContext, useState, ReactNode } from "react";


interface userData {
  user : string;
  isAdmin : boolean;
  money : number;
  level: number;
  achievements: string[];
  badges: string[];
}


interface AuthContextType {
  user: string | null;
  logout: () => void;
  login: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
