import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
        "http://localhost:8000/users/updatePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => navigate("/"), 1500); // Navigate to home after 1.5 seconds
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleChange}>
        <div className="input-field">
          <label htmlFor="oldPassword" className={oldPassword ? "active" : ""}>
            Old Password:
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-field">
          <label htmlFor="newPassword" className={newPassword ? "active" : ""}>
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" className="btn-submit">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
