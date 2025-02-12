import React, { useState } from 'react';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { IoHome } from "react-icons/io5";
import '../cssf/Signup.css';
import Footer from '../components/Footer';

const Signup = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!firstname.trim()) newErrors.firstname = 'First Name is required.';
    if (!lastname.trim()) newErrors.lastname = 'Last Name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'A valid email is required.';
    if (!phonenumber.trim() || !/^\d{10}$/.test(phonenumber))
      newErrors.phonenumber = 'A valid 10-digit phone number is required.';
    if (!password.trim() || password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    const data = {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
    };

    setLoading(true);
    axios
      .post('http://localhost:5555/users', data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Signup successful', { variant: 'success' });
        alert("SuccessFull");
        navigate("/signin");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(
          error.response?.data?.message || 'Error: Unable to signup',
          { variant: 'error' }
        );
        console.error('Signup error:', error.response || error.message || error);
      });
  };

  return (
    <>
     <nav className="nav-container">
        <div className="logo">NADAKKADAVUNKAL HARDWARE</div>
      </nav>
      <IoHome className="iconn-home" onClick={()=>{navigate('/')}}/>

    <div className="signup-container">      
      <div className="signup-card">
        <h1 className="signup-title">Signup</h1>
        {loading && <Spinner />}
        <div className="signup-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="form-input"
              placeholder="Enter your first name"
            />
            {errors.firstname && <p className="error-text">{errors.firstname}</p>}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="form-input"
              placeholder="Enter your last name"
            />
            {errors.lastname && <p className="error-text">{errors.lastname}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              className="form-input"
              placeholder="Enter your phone number"
            />
            {errors.phonenumber && (
              <p className="error-text">{errors.phonenumber}</p>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Create a password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>
          <button onClick={handleSignup} className="signup-button">
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
        </div>
        <p className="footer-text">
          Already have an account? <Link to="/signin">Login</Link>
        </p>
      </div>
    </div>
<Footer/>
    </>
  );
};

export default Signup;
