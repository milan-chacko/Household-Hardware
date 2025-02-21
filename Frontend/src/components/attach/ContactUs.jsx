import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import { IoHome } from "react-icons/io5";
import "../cssf/ContactUs.css";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [previousQueries, setPreviousQueries] = useState([]);
  const navigate = useNavigate();

  // 📌 Submit Query to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5555/query/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        toast.success("Query submitted successfully!");
        setEmail("");
        setMessage("");
      } else {
        toast.error("Failed to submit query.");
      }
    } catch (error) {
      toast.error("Error connecting to server.");
    }
  };

  // 📌 Fetch Previous Queries
  const fetchPreviousQueries = async () => {
    if (!searchEmail) {
      toast.error("Please enter an email to search.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5555/query/queries?email=${searchEmail}`
      );
      const data = await response.json();

      if (data.length > 0) {
        setPreviousQueries(data);
      } else {
        setPreviousQueries([]);
        toast.info("No queries found for this email.");
      }
    } catch (error) {
      toast.error("Error fetching previous queries.");
    }
  };

  return (
    <>
      <nav className="nav-container">
        <div className="logo">Household HARDWARE</div>
      </nav>
      <div className="bgc">
        <IoHome className="icon-home" onClick={()=>{navigate('/')}}/>
        <div className="contact-container">
          <h2>Contact Us</h2>

          {/* 📌 Query Submission Form */}
          <form onSubmit={handleSubmit} className="contact-form">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Your Query:</label>
            <textarea
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>

            <button type="submit">Submit</button>
          </form>

          <hr className="divider" />

          {/* 📌 Section for Checking Previous Queries */}
          <div className="previous-queries">
            <h3>Check Previous Queries</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button onClick={fetchPreviousQueries}>Fetch Queries</button>

            {previousQueries.length > 0 ? (
              <ul className="query-list">
                {previousQueries.map((query) => (
                  <li key={query._id} className="query-item">
                    <small>
                      📅 {new Date(query.createdAt).toLocaleString()}
                    </small>
                    <p>
                      📩 <strong>You:</strong> {query.message}
                    </p>
                    <p>
                      🛠️ <strong>Admin:</strong>{" "}
                      {query.reply
                        ? query.reply
                        : "Awaiting response from admin..."}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-queries">No queries found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
