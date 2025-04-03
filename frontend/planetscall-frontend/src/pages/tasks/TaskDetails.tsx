import React, { useState } from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/shared/Header';

const TaskDetails = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="app-container">
    <Header/>
    <section className="blockCode">
    {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <>



        </>
      )}
    </section>
    <Footer/>
      
    </div>
  )
}

export default TaskDetails
