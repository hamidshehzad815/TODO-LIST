// Profile.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaUser, FaEnvelope, FaUserShield } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/users/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Failed to fetch profile data.");
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="profile-container">
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {profile && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.username?.charAt(0).toUpperCase()}
            </div>
            <h2 className="profile-name">{profile.username}</h2>
            <span className="profile-role-badge">{profile.role}</span>
          </div>
          
          <div className="profile-info">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-content">
                <label>Username</label>
                <span>{profile.username}</span>
              </div>
            </div>
            
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-content">
                <label>Email</label>
                <span>{profile.email}</span>
              </div>
            </div>
            
            <div className="info-item">
              <FaUserShield className="info-icon" />
              <div className="info-content">
                <label>Role</label>
                <span>{profile.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;