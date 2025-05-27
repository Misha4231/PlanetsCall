
import React from 'react';
import { Outlet } from 'react-router-dom';
import TitleUpdater from '../hooks/TitleChanger'; 

const RootLayout: React.FC = () => {
  return (
    <>
      <TitleUpdater />
      <Outlet />
    </>
  );
};

export default RootLayout;
