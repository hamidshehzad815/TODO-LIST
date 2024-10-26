import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangeUsername.css";

const ChangeUsername = () => {
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/users/updateUsername",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newUsername }),
        }
      );

      if (response.ok) {
        setSuccess("Username updated successfully!");
        setTimeout(() => navigate("/profile"), 1500); // Navigate to profile after 1.5 seconds
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update username.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="change-username-container">
      <h2>Change Username</h2>
      <form onSubmit={handleChange}>
        <div className="input-field">
          <label htmlFor="newUsername" className={newUsername ? "active" : ""}>
            New Username:
          </label>
          <input
            type="text"
            id="newUsername"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" className="btn-submit">
          Change Username
        </button>
      </form>
    </div>
  );
};

export default ChangeUsername;
