import React, { useState } from 'react';
import Home from '../pages/home/Home';
import '../stylePage/styles.css';

import { createBrowserRouter, Link, RouterProvider, useNavigate } from 'react-router-dom';

//import NotFound from '../pages/NotFound/NotFound';

//PROFILE LINKS
import { AuthProvider, useAuth } from '../context/AuthContext';
import NotFound from '../pages/NotFound/NotFound';
import Shop from '../pages/shop/Shop';

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
import AnOrganisation from '../pages/community/AnOrganisation';
import OrganisationAdmin from '../pages/community/OrganisationAdmin';
import OrganisationSettings from '../pages/community/OrganisationSettings';
import TaskList from '../pages/tasks/TaskList';
import TaskDetails from '../pages/tasks/TaskDetails';
import AdminMain from '../pages/admin/AdminMain';
import Verification from '../pages/admin/AdminOrganisations';
import Task from '../pages/admin/AdminTaskInfo';
import TaskSettings from '../pages/admin/AdminTaskSettings';
import OrganisationTaskManagement from '../pages/community/OrganisationTaskManagement';
import AdminOrganisations from '../pages/admin/AdminOrganisations';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminTasks from '../pages/admin/AdminTasks';
import AdminTaskInfo from '../pages/admin/AdminTaskInfo';
import AdminTaskSettings from '../pages/admin/AdminTaskSettings';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
    path: '/community/organisation/:organisationUniqueName/admin',
    element: <OrganisationAdmin/>
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
    path: '/community/organisation/:organisationUniqueName/settings',
    element: <OrganisationSettings/>
  },
  {
    path: '/community/organisation/:organisationUniqueName/settings/tasks',
    element: <OrganisationTaskManagement/>
  },
  {
    path: '/community/settings',
    element: <CommunitySettings/>
  },
  
  {
    path: '/shop',
    element: <Shop />
  },
  {
    path: '/tasks',
    element: <TaskList />
  },
  {
    path: '/task/:taskId',
    element: <TaskDetails />
  },

  
  {
    path: '/admin',
    element: <AdminMain />
  },
  {
    path: '/admin/organisations',
    element: <AdminOrganisations />
  },
  {
    path: '/admin/users',
    element: <AdminUsers />
  },
  {
    path: '/admin/tasks',
    element: <AdminTasks />
  },
  {
    path: '/admin/organisations/task/:taskId',
    element: <AdminTaskInfo />
  },
  {
    path: '/admin/organisations/task/:taskId/settings',
    element: <AdminTaskSettings />
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
