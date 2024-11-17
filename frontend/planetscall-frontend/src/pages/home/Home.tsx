import React from 'react';
import './home.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header/>
      <h1>Welcome to Home Paged</h1>
      <Footer/>
    </div>
  );
};

export default Home;
