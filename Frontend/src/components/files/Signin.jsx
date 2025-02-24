import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../cssf/Signin.css";
import axios from "axios";
import Footer from "../components/Footer";
import Authapi from "../../utils/Authapi";
import { IoHome } from "react-icons/io5";
import { signin } from "./Auth-api";
import { useAuth } from "./AuthContext";

function Signin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const auth = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const authApi = React.useContext(Authapi);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error messages
    setSuccessMessage(""); // Clear previous success messages
    try {
      const res = await signin({ email, password }); // Call the API

      if (res.data.auth) {
        const firstname = res.data.firstname; // Extract firstname from response
        const role = res.data.role;
        const userId = res.data.userId;
        authApi.setAuth(true); // Update auth state in context
        localStorage.setItem("auth", true); // Store auth state in localStorage
        localStorage.setItem("firstname", firstname); // Store firstname in localStorage
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        setSuccessMessage(res.data.message); // Set success message

        if (role === "admin") {
          navigate("/dashboard"); // Redirect to the dashboard
        } else if (role === "user") {
          navigate("/"); // Redirect to user dashboard
        } else {
          alert("no user"); // Default dashboard for other roles
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        setError(res.data.message); // Display the error message from backend
      }
    } catch (err) {
      console.error("Signin error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message); // Backend-provided error
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <nav className="nav-container">
        <div className="logo">HOUSEHOLD HARDWARE</div>
      </nav>
      <div className="divicon">
        {" "}
        <IoHome
          className="iconn-home"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>

      <div className="containner">
        <div className="form-wrapper">
          <div className="heading">Sign In</div>
          <form className="form" onSubmit={handleSubmit}>
            <input
              placeholder="E-mail"
              id="email"
              name="email"
              type="email"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="forgot-password">
              <p>
                Don’t have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </span>
            {error && (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {error}
              </p>
            )}
            {/* {successMessage && (
            <p style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{successMessage}</p>
          )} */}
            <button className="login-button">Sign In</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signin;
