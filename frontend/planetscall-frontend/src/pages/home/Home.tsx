import React from 'react';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/shared/Header';

const Home: React.FC = () => {
  return (
    <div className="app-container">
      <Header/>
      <section className="blockCode">
        <h1>Welcome to Home Paged</h1>
        <p>To be continued...</p>
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
