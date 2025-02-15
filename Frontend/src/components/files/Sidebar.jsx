import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Sidebar = ({ firstname, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const role= localStorage.getItem("role");

  if (role !== "admin") {
    navigate('/'); // Redirect to the dashboard
  }

  return (
    <>
      <button 
        className={`sidebar-toggle ${isOpen ? 'sidebar-open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Welcome, {firstname}!</h2>
        </div>
        <nav>
          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add-category"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
               Add-Category
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
                Edit
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/filter"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
                Orders
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/sales"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
                Sales
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/query"
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={() => window.innerWidth <= 768 && setIsOpen(false)}
              >
                Contact-Queries
              </NavLink>
            </li>
          </ul>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </>
  );
};

export default Sidebar;