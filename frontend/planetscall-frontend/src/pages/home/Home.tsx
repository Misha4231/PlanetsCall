import React from 'react';
import './home.css';
import Header from '../../components/Header/Header';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header/>
      <h1>Welcome to Home Page</h1>
    </div>
  );
};

export default Home;
