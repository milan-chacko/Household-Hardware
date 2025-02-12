import React, { useEffect } from 'react'
import Sidebar from './Sidebar';
import { useNavigate } from "react-router-dom";
import ProductsPage from './Productspage';
import { signout } from "./Auth-api";
import Authapi from "../../utils/Authapi";


const Products = () => {
  const authApi = React.useContext(Authapi);
  const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname'); // Retrieve firstname
    
     useEffect(() => {
       
    
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
      <ProductsPage/>
    </main>
  </div>  )
}

export default Products