import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoKeyOutline } from "react-icons/io5";
import "../cssf/UserProfile.css"; // Import the external CSS file
import Footer from "../components/Footer";
import BackButton from "../BackButton";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const userResponse = await axios.get(
          `http://localhost:5555/api/users/${userId}`
        );
        setUserDetails(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setFormData({ ...userDetails });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      await axios.put(`http://localhost:5555/api/users/${userId}`, formData);
      setUserDetails(formData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New Password and Confirm Password do not match.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("New Password must be at least 8 characters long.");
      return;
    }
    if (
      !/\d/.test(passwordData.newPassword) ||
      !/[A-Z]/.test(passwordData.newPassword)
    ) {
      alert(
        "New Password must include at least one number and one uppercase letter."
      );
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `http://localhost:5555/${userId}/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );

      if (response.data.success) {
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Password changed successfully!");
      } else {
        alert(
          response.data.message ||
            "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again later.");
    }
  };

  if (loading) return <div className="loading"><StyleddWrapper>
  <div className="loader3">
    <div className="circle1" />
    <div className="circle1" />
    <div className="circle1" />
    <div className="circle1" />
    <div className="circle1" />
  </div>
</StyleddWrapper></div>;

  return (
    <>
     <div style={{padding:"17px 0px 0px 5rem" }}><BackButton/>
     </div>
    <div className="profile-container">
      <StyledWrapper>
        <div className="card">
          <div className="image" />
          <div className="card-info">
            <span>
              {userDetails.firstname} {userDetails.lastname}
            </span>
            <p>{userDetails.email}</p>
          </div>
        </div>
      </StyledWrapper>

      <h2 className="profile-heading">User Profile</h2>
      {userDetails ? (
        <div className="profile-details">
          <h3 className="details-heading">Details:</h3>
          <p>
            <strong>Name:</strong> {userDetails.firstname}{" "}
            {userDetails.lastname}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails.phonenumber}
          </p>
          <p>
            <strong>Address:</strong> {userDetails.address || "Not provided"}
          </p>
          <p>
            <strong>Location:</strong> {userDetails.location || "Not provided"}
          </p>
          <div className="button-container">
            <StyledWrapperr>
              <button  onClick={handleEditClick}>
              
                <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>  Edit</span>
              </button>
            </StyledWrapperr>

            <StyledWrapperr>
              <button
                onClick={() => navigate("/user/orders")}
              >
                 <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gift-fill" viewBox="0 0 16 16">
  <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9z"/>
</svg> Orders</span>
              </button>
            </StyledWrapperr>

            <StyledWrapperr>
              <button
                onClick={() => setIsChangingPassword(true)}
              >
               <span><IoKeyOutline />Password</span>
              </button>
            </StyledWrapperr>
          </div>
        </div>
      ) : (
        <p className="not-found">User not found</p>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-modal">
          <form className="edit-form" onSubmit={handleFormSubmit}>
            <h2>EDIT PROFILE</h2>
            <label>
              First Name:
              <input
                type="text"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                disabled
                readOnly
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phonenumber"
                value={formData.phonenumber || ""}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
              />
            </label>
            <div className="modal-buttons">
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isChangingPassword && (
        <div className="edit-modal">
          <form className="edit-form" onSubmit={handlePasswordChangeSubmit}>
            <h2>Change Password</h2>
            <label>
              Current Password:
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </label>
            <div className="modal-buttons">
              <button type="submit">Update Password</button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};
const StyledWrapper = styled.div`
  .card {
    width: 350px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 7rem;
    margin-top: 5rem;
    justify-content: center;
    text-align: center;
    gap: 10px;
    background-color: #fffffe;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: "";
    width: 350px;
    height: 100px;
    position: absolute;
    top: 0;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom: 3px solid #fefefe;
    background: linear-gradient(
      40deg,
      rgba(131, 58, 180, 1) 0%,
      rgba(253, 29, 29, 1) 50%,
      rgba(252, 176, 69, 1) 100%
    );
    transition: all 0.5s ease;
  }

  .card * {
    z-index: 1;
  }

  .image {
    width: 90px;
    height: 90px;
    background-color: #1468bf;
    border-radius: 50%;
    border: 4px solid #fefefe;
    margin-top: 30px;
    transition: all 0.5s ease;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    transition: all 0.5s ease;
  }

  .card-info span {
    font-weight: 600;
    font-size: 24px;
    color: #161a42;
    margin-top: 15px;
    line-height: 5px;
  }

  .card-info p {
    color: rgba(0, 0, 0, 0.5);
  }

  .button {
    text-decoration: none;
    background-color: #e09145;
    color: white;
    padding: 5px 20px;
    border-radius: 5px;
    border: 1px solid white;
    transition: all 0.5s ease;
  }

  .card:hover::before {
    width: 350px;
    height: 300px;
    border-bottom: none;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    transform: scale(0.95);
  }

  .card:hover .card-info {
    transform: translate(0%, -25%);
  }

  .card:hover .image {
    transform: scale(2) translate(-60%, -40%);
  }

  .button:hover {
    background-color: #ff6844;
    transform: scale(1.1);
  }
`;

const StyledWrapperr = styled.div`
   button {
    padding: 0.1em 0.25em;
    width: 13em;
    height: 4.2em;
    background-color: #1468bf;
    border: 0.08em solid #fff;
    border-radius: 0.3em;
    font-size: 12px;
    cursor: pointer;
  }

  button span {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0.4em;
    width: 8.25em;
    height: 2.5em;
    background-color: #1468bf;
    border-radius: 0.2em;
    font-size: 1.5em;
    color: #fff;
    border: 0.08em solid #fff;
    box-shadow: 0 0.4em 0.1em 0.019em #fff;
  }

  button span:hover {
    transition: all 0.1s;
     background-color:#e09145;
    transform: translate(0, 0.4em);
    box-shadow: 0 0 0 0 #fff;
  }
    button svg{
    margin-right:10px;
    }

  button span:not(hover) {
    transition: all 1s;
  }`;


  const StyleddWrapper = styled.div`
  .loader3 {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle1 {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 10px;
    background-color:white;
    animation: circle1 1s ease-in-out infinite;
  }

  .circle1:nth-child(2) {
    animation-delay: 0.2s;
  }

  .circle1:nth-child(3) {
    animation-delay: 0.4s;
  }

  .circle1:nth-child(4) {
    animation-delay: 0.6s;
  }

  .circle1:nth-child(5) {
    animation-delay: 0.8s;
  }

  @keyframes circle1 {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }`;


export default UserProfile;
