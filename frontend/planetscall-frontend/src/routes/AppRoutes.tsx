import React from 'react';
import Home from '../pages/home/Home';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '../App';
import NotFound from '../pages/NotFound/NotFound';

//PROFILE LINKS
import Profile from '../pages/profile/Profile';
import UserProfile from '../pages/profile/UsersProfile';
import Statistics from '../pages/profile/Statistics';
import Achievements from '../pages/profile/Achievements';
import LevelTree from '../pages/profile/LevelTree';
import Shop from '../pages/profile/Shop';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound/>
  },
  {
    path: '/profile',
    element: <Profile />
  },
  {
    path: '/profile/shop',
    element: <Shop />
  },
  {
    path: '/profile/level',
    element: <LevelTree />
  },
  {
    path: '/profile/achivements',
    element: <Achievements />
  },
  {
    path: '/profile/statistics',
    element: <Statistics />
  },
  {
    path: '/:userName',
    element: <UserProfile />
  },
]);

const AppRoutes: React.FC = () => {
  return (
    <div className="container">
      <RouterProvider router={router}/>
    </div>
  );
};

export default AppRoutes;
