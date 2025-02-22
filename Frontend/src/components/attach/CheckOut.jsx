import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Menu, X } from "lucide-react";
import CheckoutPage from "./CheckoutPage";
const CheckOut = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [firstname, setFirstname] = useState("User"); // Default to "User"
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if the user is logged in
    const navigate = useNavigate();
  
    useEffect(() => {
      // Retrieve user authentication state and firstname from localStorage
      const auth = localStorage.getItem("auth") === "true";
      const storedFirstname = localStorage.getItem("firstname");
  
      setIsAuthenticated(auth);
      setFirstname(auth && storedFirstname ? storedFirstname : "User");
    }, []);
  
    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };
  
    const handleLogout = () => {
      // Clear auth details on logout
      localStorage.removeItem("auth");
      localStorage.removeItem("firstname");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
      setFirstname("User");
      navigate("/signin"); // Redirect to login
    };
  
    const handleLogin = () => {
      navigate("/signin"); // Redirect to login
    };
  
    return (
      <div >
        {/* Sidebar Toggle Button */}
        <button
          className={`sidebar-togglee ${isOpen ? "sidebar-openn" : ""}`}
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
  
        {/* Sidebar */}
        <aside className={`sidebarr ${isOpen ? "open" : ""}`}>
          <div className="sidebar-headerr">
            <h2>{isAuthenticated ? `Hi, ${firstname}!` : "Welcome!"}</h2>
          </div>
          <nav>
            <ul className="sidebar-menuu">
              {isAuthenticated && (
                <>
                  {/* Home Button */}
                  <li>
                    <StyledWrapper>
                      <div className="button-container"  onClick={() => navigate("/")}>
                        <button
                          className="button"
                          onClick={() => navigate("/")} // Navigate to Home
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 1024 1024"
                            fill="currentColor"
                            className="icon"
                          >
                            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
                          </svg>
                        </button>
                      </div>
                    </StyledWrapper>
                  </li>
  
                  {/* Profile Button */}
                  <li>
                    <StyledWrapper>
                      <div className="button-container" onClick={() => navigate("/profile")}>
                        <button
                          className="button"
                          onClick={() => navigate("/profile")} // Navigate to Profile
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="icon"
                          >
                            <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
                          </svg>
                        </button>
                      </div>
                    </StyledWrapper>
                  </li>
  
                  {/* Cart Button */}
                  <li>
                    <StyledWrapper>
                      <div className="button-container" onClick={() => navigate("/cart")}>
                        <button
                          className="button"
                          onClick={() => navigate("/cart")} // Navigate to Cart
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            fill="none"
                            stroke="currentColor"
                            className="icon"
                          >
                            <circle r={1} cy={21} cx={9} />
                            <circle r={1} cy={21} cx={20} />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                      </div>
                    </StyledWrapper>
                  </li>
                </>
              )}
              <li>
                {isAuthenticated ? (
                  <button className="logout-buttonn" onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <>
                    <p className="login-reminder">
                      Please log in to see your Profile and Cart
                    </p>
                    <button className="login-button" onClick={handleLogin}>
                      Login
                    </button>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </aside>
  
        {/* Overlay */}
        {isOpen && <div className="sidebar-overlayy" onClick={toggleSidebar} />}
  
        {/* Main Content */}
        <div className={`main-contentt ${isOpen ? "shiftedd" : ""}`}>
          <CheckoutPage/>
        </div>
      </div>
    );
  };
  
  const StyledWrapper = styled.div`
    .button-container {
      display: flex;
      background-color: #e09145;
      width: 210px;
      height: 40px;
      align-items: center;
      justify-content: space-around;
      border-radius: 10px;
    }
  
    .button {
      outline: 0 !important;
      border: 0 !important;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e09145;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      transition: all ease-in-out 0.3s;
      cursor: pointer;
    }
  
    .button-container:hover {
      transform: translateY(-3px);
    }
  
    .button:hover {
      transform: translateY(-3px);
    }
  
    .icon {
      font-size: 20px;
    }
  `;

export default CheckOut