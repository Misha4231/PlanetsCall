import React, { useState } from 'react';
import Home from '../pages/home/Home';

import { createBrowserRouter, Link, RouterProvider, useNavigate } from 'react-router-dom';

import App from '../App';
//import NotFound from '../pages/NotFound/NotFound';

//PROFILE LINKS
import { AuthProvider, useAuth } from '../context/AuthContext';
import NotFound from '../pages/NotFound/NotFound';
import Shop from '../pages/shop/Shop';
import { User } from "../pages/profile/types";

import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

import Profile from '../pages/profile/Profile';
import UserProfile from '../pages/profile/UsersProfile';
import Statistics from '../pages/profile/Statistics';
import Achievements from '../pages/profile/Achievements';
import LevelTree from '../pages/profile/LevelTree';
import ChangePassword from '../pages/auth/ChangePassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ActivateAccount from '../pages/auth/ActivateAccount';
import Settings from '../pages/profile/Settings';
import Friends from '../pages/community/Friends';
import CommunityMain from '../pages/community/CommunityMain';
import CommunitySettings from '../pages/community/CommunitySettings';
import Organisations from '../pages/community/Organisations';
import CreateOrganisation from '../pages/community/CreateOrganisation';
import FindOrganisation from '../pages/community/FindOrganisation';
import AnOrganisation from '../pages/community/AnOrganisation';

const mockUser: User = {
  id: 1,
  email: "example@example.com",
  username: "John Doe",
  profile_image: "https://example.com/profile.jpg",
  points: 100,
  description: "Passionate learner",
  theme_preference: 0,
  created_at: "2023-01-01",
  last_login_at: "2023-12-01",
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    /*errorElement: <NotFound/>*/
  },

  //LOGIN
  {
    path: '/auth/sign-in',
    element: <SignIn />,
  },
  {
    path: '/auth/sign-up',
    element: <SignUp />,
  },
  {
    path: '/auth/change-password',
    element: <ChangePassword />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/activate-account',
    element: <ActivateAccount />,
  },


  {
    path: '/profile/settings',
    element: <Settings />
  },
  {
    path: '/profile',
    element: <Profile/>
  },
  {
    path: '/profile/level',
    element: <LevelTree />
  },
  {
    path: '/profile/achievements',
    element: <Achievements />
  },
  {
    path: '/profile/statistics',
    element: <Statistics />
  },
  {
    path: '/user/:userName',
    element: <UserProfile />
  },
  {
    path: '/profile/level-tree',
    element: <LevelTree/>
  },

  
  {
    path: '/community',
    element: <CommunityMain />
  },
  {
    path: '/community/friends',
    element: <Friends/>
  },
  {
    path: '/community/organisations',
    element: <Organisations/>
  },
  {
    path: '/community/organisation/:organisationUniqueName',
    element: <AnOrganisation/>
  },
  {
    path: '/community/organisations/create',
    element: <CreateOrganisation/>
  },
  {
    path: '/community/organisations/find',
    element: <FindOrganisation/>
  },
  {
    path: '/community/settings',
    element: <CommunitySettings/>
  },
  
  {
    path: '/shop',
    element: <Shop />
  },
]);



const PrivateRoute: React.FC<{ component: JSX.Element }> = ({ component }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate(); 
  if (!isAuthenticated) {
    navigate('/auth/sign-in');  
    return null;  
  }
  return component;
};

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      
      <RouterProvider router={router} />
    </AuthProvider>
  );
};


export default AppRoutes;
