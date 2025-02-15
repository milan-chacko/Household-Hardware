import React from 'react';
import Sidebar from './Sidebar';

const Profile = () => {
  const firstname = localStorage.getItem('firstname'); // Retrieve firstname

  const role= localStorage.getItem("role");

  if (role !== "admin") {
    navigate('/'); // Redirect to the dashboard
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await signout();
      authApi.setAuth(res.data.auth);
      localStorage.removeItem('auth');
      localStorage.removeItem('firstname');
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar firstname={firstname} handleLogout={handleLogout} />
      <main className="main-content">
        <h1>Profile</h1>
        <p>This is the profile page content.</p>
      </main>
    </div>
  );
};

export default Profile;
