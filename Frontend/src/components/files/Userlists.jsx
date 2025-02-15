import React, { useEffect, useState } from "react";
import axios from "axios";
import "../cssf/Userlists.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]); // Store user details
  const [userCount, setUserCount] = useState(0); // Store the total count of users

  const role= localStorage.getItem("role");

  if (role !== "admin") {
    navigate('/'); // Redirect to the dashboard
  }


  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/users");
        setUsers(response.data);
        setUserCount(response.data.length); // Set the total count of users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="users-page">
      <h1>Users</h1>
      <h2><span style={{ color: "#5A243A", fontWeight: "bold" }}> Total Users: {userCount}</span></h2> {/* Display total user count */}
      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <h3>{user.firstname} {user.lastname}</h3>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phonenumber || "N/A"}</p>
              {/* Add more user details as needed */}
            </div>
          ))
        ) : (
          <p>No users available</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
