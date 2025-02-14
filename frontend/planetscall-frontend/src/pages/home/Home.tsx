import React from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header/>
      <h1>Welcome to Home Paged</h1>
      <p>To be continued...</p>
      <Footer/>
    </div>
  );
};

export default Home;
