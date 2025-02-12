import React,{useEffect} from 'react'
import Sidebar from './Sidebar';
import AddCategoryPage from './AddCategoryPage';
import { useNavigate } from "react-router-dom";
import { signout } from "./Auth-api";
import Authapi from "../../utils/Authapi";


const Category = () => {

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
      <AddCategoryPage/>
    </main>
  </div>  
  )
}

export default Category