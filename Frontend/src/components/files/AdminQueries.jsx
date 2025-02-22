import React, { useEffect, useState } from "react";
import "../cssf/AdminQueries.css";
import Footer from "../components/Footer";
import BackButton from "../BackButton";

const AdminQueries = () => {
  const [pendingQueries, setPendingQueries] = useState([]);
  const [answeredQueries, setAnsweredQueries] = useState([]);
  const [filteredPending, setFilteredPending] = useState([]);
  const [filteredAnswered, setFilteredAnswered] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [filterEmail, setFilterEmail] = useState("");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const pendingResponse = await fetch(
        "http://localhost:5555/query/pending"
      );
      const answeredResponse = await fetch(
        "http://localhost:5555/query/answered"
      );

      const pendingData = await pendingResponse.json();
      const answeredData = await answeredResponse.json();

      setPendingQueries(pendingData);
      setAnsweredQueries(answeredData);
      setFilteredPending(pendingData);
      setFilteredAnswered(answeredData);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleReplySubmit = async (queryId) => {
    if (!replyMessage) {
      alert("Please enter a reply.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5555/query/reply/${queryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyMessage }),
        }
      );

      if (response.ok) {
        alert("Reply sent successfully!");
        setReplyMessage("");
        fetchQueries(); // Refresh queries after update
      } else {
        alert("Failed to send reply.");
      }
    } catch (error) {
      console.error("Error updating query:", error);
    }
  };

  // Filter function based on email
  const handleFilterChange = (e) => {
    const email = e.target.value.toLowerCase();
    setFilterEmail(email);

    setFilteredPending(
      pendingQueries.filter((query) =>
        query.email.toLowerCase().includes(email)
      )
    );
    setFilteredAnswered(
      answeredQueries.filter((query) =>
        query.email.toLowerCase().includes(email)
      )
    );
  };

  return (
    <>
    <div className="alpp"> <div style={{ padding: "0px 0px 0px 5rem" }}>
        {" "}
        <BackButton/>
      </div>
    <div className="admin-queries-container">
      <h2>Admin Queries</h2>
      {/* Email Filter Input */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by email..."
          value={filterEmail}
          onChange={handleFilterChange}
        />
      </div>

      {/* Pending Queries */}
      <h3>Pending Queries</h3>
      {filteredPending.length === 0 ? (
        <p className="no-queries">No pending queries found.</p>
      ) : (
        filteredPending.map((query) => (
          <div key={query._id} className="query-card">
            <p>
              <strong>Email:</strong> {query.email}
            </p>
            <p>
              <strong>Query:</strong> {query.message}
            </p>

            <textarea
              placeholder="Enter your reply"
              value={selectedQueryId === query._id ? replyMessage : ""}
              onChange={(e) => {
                setSelectedQueryId(query._id);
                setReplyMessage(e.target.value);
              }}
            />

            <button onClick={() => handleReplySubmit(query._id)}>
              Send Reply
            </button>
          </div>
        ))
      )}

      {/* Answered Queries */}
      <h3>Answered Queries</h3>
      {filteredAnswered.length === 0 ? (
        <p className="no-queries">No answered queries found.</p>
      ) : (
        filteredAnswered.map((query) => (
          <div key={query._id} className="query-card answered">
            <p>
              <strong>Email:</strong> {query.email}
            </p>
            <p>
              <strong>Query:</strong> {query.message}
            </p>
            <p>
              <strong>Reply:</strong> {query.reply}
            </p>
          </div>
        ))
      )}
    </div>
    </div>
    </>
  );
};

export default AdminQueries;
