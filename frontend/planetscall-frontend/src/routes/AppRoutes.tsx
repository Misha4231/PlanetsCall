import React, { useState } from 'react';
import Home from '../pages/home/Home';
import '../stylePage/styles.css';

import { createBrowserRouter, Link, RouterProvider, useNavigate } from 'react-router-dom';

//import NotFound from '../pages/NotFound/NotFound';

//PROFILE LINKS
import { AuthProvider, useAuth } from '../context/AuthContext';
import NotFound from '../pages/Additional/NotFound';
import Shop from '../pages/shop/Shop';

import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

import Profile from '../pages/profile/Profile';
import UserProfile from '../pages/people/UsersProfile';
import Statistics from '../pages/profile/Statistics';
import Achievements from '../pages/profile/Achievements';
import LevelTree from '../pages/profile/LevelTree';
import ChangePassword from '../pages/auth/ChangePassword';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ActivateAccount from '../pages/auth/ActivateAccount';
import Settings from '../pages/profile/Settings';
import Friends from '../pages/people/Friends';
import CommunityMain from '../pages/community/CommunityMain';
import CommunitySettings from '../pages/community/CommunitySettings';
import Organisations from '../pages/organisations/Organisations';
import CreateOrganisation from '../pages/organisations/CreateOrganisation';
import AnOrganisation from '../pages/organisations/AnOrganisation';
import OrganisationAdmin from '../pages/organisations/organisationAdmin/OrganisationAdmin';
import OrganisationSettings from '../pages/organisations/organisationAdmin/OrganisationSettings';
import TaskList from '../pages/tasks/TaskList';
import TaskDetails from '../pages/tasks/TaskDetails';
import AdminMain from '../pages/admin/AdminMain';
import OrganisationTaskManagement from '../pages/organisations/organisationAdmin/OrganisationTask';
import AdminOrganisations from '../pages/admin/AdminOrganisations';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminTasks from '../pages/admin/AdminTasks';
import AdminTaskInfo from '../pages/admin/task/AdminTaskInfo';
import AdminTaskSettings from '../pages/admin/task/AdminTaskSettings';
import People from '../pages/people/People';
import SearchOrganisation from '../pages/organisations/SearchOrganisation';
import AdminShop from '../pages/admin/AdminShop';
import AdminShopCategory from '../pages/admin/shop/AdminShopCategory';
import AdminShopCreateCategory from '../pages/admin/shop/AdminShopCreateCategory';
import AdminShopCreateItem from '../pages/admin/shop/AdminShopCreateItem';
import AdminShopEditCategory from '../pages/admin/shop/AdminShopEditCategory';
import AdminShopEditItem from '../pages/admin/shop/AdminShopEditItem';
import OrganisationCreateTask from '../pages/organisations/organisationAdmin/OrganisationCreateTask';
import AdminTaskCreate from '../pages/admin/task/AdminTaskCreate';
import AdminTaskAllVerification from '../pages/admin/task/AdminTaskAllVerification';


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
    path: '/profile/level-tree',
    element: <LevelTree/>
  },

  
  {
    path: '/community',
    element: <CommunityMain />
  },
  {
    path: '/community/settings',
    element: <CommunitySettings/>
  },

  
  {
    path: '/community/users',
    element: <People />
  },
  {
    path: '/community/friends',
    element: <Friends/>
  },
  {
    path: '/user/:userName',
    element: <UserProfile />
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
    path: '/community/organisations',
    element: <Organisations/>
  },
  {
    path: '/community/organisations/search',
    element: <SearchOrganisation/>
  },
  {
    path: '/community/organisation/:organisationUniqueName/settings',
    element: <OrganisationSettings/>
  },
  {
    path: '/community/organisation/:organisationUniqueName/tasks',
    element: <OrganisationTaskManagement/>
  },
  {
    path: '/community/organisation/:organisationUniqueName/tasks/create',
    element: <OrganisationCreateTask/>
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
    path: '/admin/shop',
    element: <AdminShop />
  },
  {
    path: '/admin/shop/category/:id',
    element: <AdminShopCategory />
  },
  {
    path: '/admin/shop/create-category',
    element: <AdminShopCreateCategory />
  },
  {
    path: '/admin/shop/create-item',
    element: <AdminShopCreateItem  />
  },
  {
    path: '/admin/shop/category/:id/edit',
    element: <AdminShopEditCategory />
  },
  {
    path: '/admin/shop/item/:id/edit',
    element: <AdminShopEditItem  />
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
    path: '/admin/task/create',
    element: <AdminTaskCreate />
  },
  {
    path: '/admin/task/overwatch',
    element: <AdminTaskAllVerification />
  },
  {
    path: '/admin/organisations/task/:taskId',
    element: <AdminTaskInfo />
  },
  {
    path: '/admin/organisations/task/:taskId/settings',
    element: <AdminTaskSettings />
  },


  {
    path: '*',
    element: <NotFound/>
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
