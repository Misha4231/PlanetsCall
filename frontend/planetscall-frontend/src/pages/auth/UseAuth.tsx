import React from 'react';
import {createContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {User} from '../profile/types';
import axios from "axios";
import { loginAPI, registerAPI } from "../../services/authService";

type UserContextType = {
    user: User | null;
    token: string | null;
    profile_image:string| null;
    points: number| null;
    description: string| null;
    theme_preference: number| null;
    created_at: string | null;
    last_login_at: string | null;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
  };
  
  type Props = { children: React.ReactNode };
  const UserContext = createContext<UserContextType>({} as UserContextType);

  
  export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);
  
    useEffect(() => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (user && token) {
        setUser(JSON.parse(user));
        setToken(token);
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      }
      setIsReady(true);
    }, []);
  
    const registerUser = async (
      email: string,
      username: string,
      password: string
    ) => {
      await registerAPI(email, username, password)
        .then((res) => {
          if (res) {
            localStorage.setItem("token", res?.data.token);
            const userObj = {
              userName: res?.data.userName,
              email: res?.data.email,
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setToken(res?.data.token!);
            setUser(userObj!);
            toast.success("Login Success!");
            navigate("/search");
          }
        })
        .catch((e) => toast.warning("Server error occured"));
    };
  
    const loginUser = async (username: string, password: string) => {
      await loginAPI(username, password)
        .then((res) => {
          if (res) {
            localStorage.setItem("token", res?.data.token);
            const userObj = {
              userName: res?.data.userName,
              email: res?.data.email,
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setToken(res?.data.token!);
            setUser(userObj!);
            toast.success("Login Success!");
            navigate("/search");
          }
        })
        .catch((e) => toast.warning("Server error occured"));
    };
  
    const isLoggedIn = () => {
      return !!user;
    };
  
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken("");
      navigate("/");
    };
  
    return (
      <UserContext.Provider
        value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
      >
        {isReady ? children : null}
      </UserContext.Provider>
    );
  };

export const UseAuth = () => React.useContext(UserContext);