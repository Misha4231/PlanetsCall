import React, { useEffect } from 'react'
import Header from '../../components/shared/Header'
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { getAddAttendance, getAnotherUser } from '../../services/userService';

const UsersProfile = () => {
  const { userName } = useParams<{ userName: string }>();
  const { user, isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const authToken = token || '';
        const anotherUser = await getAnotherUser(authToken, "Sarna");
        console.log('Attendance Data:', anotherUser);
      } catch (err: any) {
        console.error('Error fetching attendance:', err.message);
      }
    };

    fetchAttendance();
  }, []);
  return (
    <div>
      <Header/>
      
    </div>
  )
}

export default UsersProfile
