import React, { useEffect, useState } from 'react'
import Header from '../../components/shared/Header'
import { getUserAttendance } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer/Footer';

const Statistics = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!isAuthenticated || !token) return;  
      if (!token ) return;  
      console.log('Attendance Data:');
      try {
        const attendanceData = await getUserAttendance(token, (user?.username + ""));
        console.log('Attendance Data:', attendanceData);
      } catch (err: any) {
        console.log(err);
      }
    };

    fetchAttendance();
  }, [isAuthenticated, token]);


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

export default Statistics
