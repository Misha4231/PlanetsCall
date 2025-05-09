import React, { useEffect, useState } from 'react';
import Home from '../pages/home/Home';
import '../stylePage/styles.css';

import { createBrowserRouter, Link, RouterProvider, useLocation, useMatches, useNavigate } from 'react-router-dom';

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
import AdminShopEditCategory from '../pages/admin/shop/AdminShopEditCategory';
import AdminShopEditItem from '../pages/admin/shop/AdminShopEditItem';
import OrganisationCreateTask from '../pages/organisations/organisationAdmin/OrganisationCreateTask';
import AdminTaskCreate from '../pages/admin/task/AdminTaskCreate';
import AdminTaskAllVerification from '../pages/admin/task/AdminTaskAllVerification';
import AdminVerificationInfo from '../pages/admin/task/AdminVerificationInfo';
import AdminShopCreateItem from '../pages/admin/shop/AdminShopCreateItem';
import TitleUpdater from '../hooks/TitleChanger';
import RootLayout from '../components/RootLayout';
import ProfileItems from '../pages/profile/ProfileItems';


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, 
    children:
    [
      {
        path: '/',
        element: <Home />,
        handle: { title: "Strona Główna | Planet's Call" },
      },
    
      // LOGIN
      {
        path: '/auth/sign-in',
        element: <SignIn />,
        handle: { title: "Zaloguj się | Planet's Call" }
      },
      {
        path: '/auth/sign-up',
        element: <SignUp />,
        handle: { title: "Zarejestruj się | Planet's Call" }
      },
      {
        path: '/auth/change-password',
        element: <ChangePassword />,
        handle: { title: "Zmień hasło | Planet's Call" },
      },
      {
        path: '/auth/forgot-password',
        element: <ForgotPassword />,
        handle: { title: "Zapomniałeś hasła? | Planet's Call" },
      },
      {
        path: '/auth/activate-account',
        element: <ActivateAccount />,
        handle: { title: "Aktywuj konto | Planet's Call" },
      },
    
      // PROFILE
      {
        path: '/profile/settings',
        element: <Settings />,
        handle: { title: "Ustawienia profilu | Planet's Call" }
      },
      {
        path: '/profile',
        element: <Profile />,
        handle: { title: "Mój profil | Planet's Call" }
      },
      {
        path: '/profile/level',
        element: <LevelTree />,
        handle: { title: "Poziom | Planet's Call" }
      },
      {
        path: '/profile/ecorus',
        element: <ProfileItems />,
        handle: { title: "Ecorus | Planet's Call" }
      },
      {
        path: '/profile/achievements',
        element: <Achievements />,
        handle: { title: "Osiągnięcia | Planet's Call" }
      },
      {
        path: '/profile/statistics',
        element: <Statistics />,
        handle: { title: "Statystyki | Planet's Call" }
      },
      {
        path: '/profile/level-tree',
        element: <LevelTree />,
        handle: { title: "Drzewko poziomów | Planet's Call" }
      },
    
      // COMMUNITY
      {
        path: '/community',
        element: <CommunityMain />,
        handle: { title: "Społeczność | Planet's Call" }
      },
      {
        path: '/community/settings',
        element: <CommunitySettings />,
        handle: { title: "Ustawienia społeczności | Planet's Call" }
      },
      {
        path: '/community/users',
        element: <People />,
        handle: { title: "Użytkownicy | Planet's Call" }
      },
      {
        path: '/community/friends',
        element: <Friends />,
        handle: { title: "Znajomi | Planet's Call" }
      },
      {
        path: '/user/:userName',
        element: <UserProfile />,
        handle: { title: "Profil użytkownika | Planet's Call" }
      },
    
      // ORGANISATIONS
      {
        path: '/community/organisation/:organisationUniqueName/admin',
        element: <OrganisationAdmin />,
        handle: { title: "Administracja organizacji | Planet's Call" }
      },
      {
        path: '/community/organisation/:organisationUniqueName',
        element: <AnOrganisation />,
        handle: { title: "Organizacja | Planet's Call" }
      },
      {
        path: '/community/organisations/create',
        element: <CreateOrganisation />,
        handle: { title: "Utwórz organizację | Planet's Call" }
      },
      {
        path: '/community/organisations',
        element: <Organisations />,
        handle: { title: "Organizacje | Planet's Call" }
      },
      {
        path: '/community/organisations/search',
        element: <SearchOrganisation />,
        handle: { title: "Szukaj organizacji | Planet's Call" }
      },
      {
        path: '/community/organisation/:organisationUniqueName/settings',
        element: <OrganisationSettings />,
        handle: { title: "Ustawienia organizacji | Planet's Call" }
      },
      {
        path: '/community/organisation/:organisationUniqueName/tasks',
        element: <OrganisationTaskManagement />,
        handle: { title: "Zarządzanie zadaniami | Planet's Call" }
      },
      {
        path: '/community/organisation/:organisationUniqueName/tasks/create',
        element: <OrganisationCreateTask />,
        handle: { title: "Nowe zadanie | Planet's Call" }
      },
    
      // SHOP & TASKS
      {
        path: '/shop',
        element: <Shop />,
        handle: { title: "Sklep | Planet's Call" }
      },
      {
        path: '/tasks',
        element: <TaskList />,
        handle: { title: "Lista zadań | Planet's Call" }
      },
      {
        path: '/task/:taskId',
        element: <TaskDetails />,
        handle: { title: "Szczegóły zadania | Planet's Call" }
      },
    
      // ADMIN
      {
        path: '/admin',
        element: <AdminMain />,
        handle: { title: "Panel administratora | Planet's Call" }
      },
      {
        path: '/admin/organisations',
        element: <AdminOrganisations />,
        handle: { title: "Organizacje (Admin) | Planet's Call" }
      },
      {
        path: '/admin/shop',
        element: <AdminShop />,
        handle: { title: "Sklep (Admin) | Planet's Call" }
      },
      {
        path: '/admin/shop/category/:id',
        element: <AdminShopCategory />,
        handle: { title: "Kategoria sklepu | Planet's Call" }
      },
      {
        path: '/admin/shop/create-category',
        element: <AdminShopCreateCategory />,
        handle: { title: "Nowa kategoria | Planet's Call" }
      },
      {
        path: '/admin/shop/category/:categoryId/create-item',
        element: <AdminShopCreateItem />,
        handle: { title: "Nowy przedmiot | Planet's Call" }
      },
      {
        path: '/admin/shop/category/:id/edit',
        element: <AdminShopEditCategory />,
        handle: { title: "Edytuj kategorię | Planet's Call" }
      },
      {
        path: '/admin/shop/category/:categoryIdParm/item/:itemId/edit',
        element: <AdminShopEditItem />,
        handle: { title: "Edytuj przedmiot | Planet's Call" }
      },
      {
        path: '/admin/users',
        element: <AdminUsers />,
        handle: { title: "Użytkownicy (Admin) | Planet's Call" }
      },
      {
        path: '/admin/tasks',
        element: <AdminTasks />,
        handle: { title: "Zadania (Admin) | Planet's Call" }
      },
      {
        path: '/admin/task/create',
        element: <AdminTaskCreate />,
        handle: { title: "Nowe zadanie (Admin) | Planet's Call" }
      },
      {
        path: '/admin/task/overwatch',
        element: <AdminTaskAllVerification />,
        handle: { title: "Weryfikacje zadań | Planet's Call" }
      },
      {
        path: '/admin/task/overwatch/:verId',
        element: <AdminVerificationInfo />,
        handle: { title: "Szczegóły weryfikacji | Planet's Call" }
      },
      {
        path: '/admin/organisations/task/:taskId',
        element: <AdminTaskInfo />,
        handle: { title: "Informacje o zadaniu | Planet's Call" }
      },
      {
        path: '/admin/organisations/task/:taskId/settings',
        element: <AdminTaskSettings />,
        handle: { title: "Ustawienia zadania | Planet's Call" }
      },
    
      // NOT FOUND
      {
        path: '*',
        element: <NotFound />,
        handle: { title: "Nie znaleziono strony | Planet's Call" }
      }
    ]
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
      <RouterProvider router={router}/>
    </AuthProvider>
  );
};


export default AppRoutes;
