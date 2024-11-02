import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    let message = "";

    // Username validation
    if (!username) {
      errors.username = "Username is required";
      message = "Username is required";
    }

    // Email validation
    if (!email) {
      errors.email = "Email is required";
      message = errors.username ? message : "Email is required"; // Show username error first if both exist
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
      message = errors.username ? message : "Email address is invalid"; // Show username error first if both exist
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      message =
        errors.username || errors.email ? message : "Password is required"; // Show earlier errors first if they exist
    } else if (password.length <= 10) {
      errors.password = "Password must be greater than 10 characters";
      message =
        errors.username || errors.email
          ? message
          : "Password must be greater than 10 characters"; // Show earlier errors first if they exist
    }

    setErrors(errors);
    setErrorMessage(message);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const response = await fetch("http://localhost:8000/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage(data.message);
          setErrorMessage(""); // Clear error message on successful signup
          setTimeout(() => navigate("/login"), 1500);
        } else {
          const errorData = await response.json();
          setErrorMessage(
            errorData.error || "Signup failed. Please try again."
          );
          setSuccessMessage(""); // Clear success message on failure
        }
      } catch (error) {
        setErrorMessage("An error occurred. Please try again.");
        setSuccessMessage(""); // Clear success message on failure
      }
    }
  };

  return (
    <div className="signup-wrapper">
      {errorMessage && <div className="error-popup show">{errorMessage}</div>}
      {successMessage && (
        <div className="success-popup show">{successMessage}</div>
      )}
      <Header className="rounded" />
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="input-field3">
            <input
              type="text"
              required
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username">Enter your username</label>
          </div>
          <div className="input-field3">
            <input
              type="text"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Enter your email</label>
          </div>
          <div className="input-field3">
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Enter your password</label>
          </div>
          <button type="submit">Sign Up</button>
          <div className="register">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
