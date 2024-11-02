import React from "react";
import "./Account.css";
import Header from "../Header/Header";
import { FaUserEdit, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Account = () => {
  return (
    <div className="account-container">
      <Header />
      <div className="account-card">
        <h2>Account Settings</h2>
        <div className="account-option">
          <FaUserEdit className="account-icon" />
          <Link to="/change-username" className="btn">
            Change Username
          </Link>
        </div>
        <div className="account-option">
          <FaLock className="account-icon" />
          <Link to="/change-password" className="btn">
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
