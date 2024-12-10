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
import { User } from "../pages/profile/types";


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
    errorElement: <NotFound/>
  },
  {
    path: '/profile',
    element: <Profile user={mockUser} />
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
    path: '/profile/Achievements ',
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
