import React, { useEffect, useState } from 'react';
import '../css/Profile.css';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          const data = await response.json();
          console.error(data.msg);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    navigate('/login'); // Redirect to the login page or homepage
  };

  if (!user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <>
      {isDesktop && <Navbar />}
      {isMobile && <BottomNavbar />}
      <div className="profile-container">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-card">
          <div className="profile-info">
            <label className="profile-label">Name:</label>
            <span className="profile-value">{user.name}</span>
          </div>
          <div className="profile-info">
            <label className="profile-label">Email:</label>
            <span className="profile-value">{user.email}</span>
          </div>
          <div className="profile-info">
            <label className="profile-label">Account Created:</label>
            <span className="profile-value">{new Date(user.date).toLocaleDateString()}</span>
          </div>
          <div className="profile-info">
            <label className="profile-label">Verified:</label>
            <span className="profile-value">{user.isVerified ? 'Yes' : 'No'}</span>
          </div>
          <div className="profile-info">
            <label className="profile-label">Terms Accepted:</label>
            <span className="profile-value">{user.terms ? 'Yes' : 'No'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Profile;
