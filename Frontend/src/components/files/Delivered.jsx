import React, { useEffect } from 'react'
import Sidebar from './Sidebar';
import { useNavigate } from "react-router-dom";
import DeliveredOrders from './DeliveredOrders';
import { signout } from "./Auth-api";
import Authapi from "../../utils/Authapi";
import '../cssf/DeliveredOrder.css';

const Delivered = () => {
    const authApi = React.useContext(Authapi);
      const navigate = useNavigate();
        const firstname = localStorage.getItem('firstname'); // Retrieve firstname
        
         useEffect(() => {
            // console.log("LocalStorage auth:", localStorage.getItem("auth"));
            // console.log("LocalStorage firstname:", localStorage.getItem("firstname"));
        
            const isAuthenticated = localStorage.getItem("auth");
            if (!isAuthenticated) {
              navigate("/signin");
            }
          }, [navigate]);
        
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
      {/* <p>This is the profile page content.</p> */}
      <DeliveredOrders/>
    </main>
  </div>  )
}

export default Delivered