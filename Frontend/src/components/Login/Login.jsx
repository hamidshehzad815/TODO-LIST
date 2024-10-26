import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    let message = "";

    // Email validation
    if (!email) {
      errors.email = "Email is required";
      message = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email address is invalid";
      message = "Email address is invalid";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      message = errors.email ? message : "Password is required"; // Show email error first if both exist
    } else if (password.length <= 10) {
      errors.password = "Password must be greater than 10 characters";
      message = errors.email
        ? message
        : "Password must be greater than 10 characters"; // Show email error first if both exist
    }

    setErrorMessage(message);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      try {
        const response = await fetch("http://localhost:8000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage(data.Message);
          setErrorMessage(""); // Clear error message on successful login

          // Store token in localStorage
          localStorage.setItem("token", data.token);

          // Navigate to homepage
          setTimeout(() => {
            navigate("/");
          }, 1500); // 1.5-second delay to show success message
        } else {
          const errorData = await response.json();
          setErrorMessage(
            errorData.message || "Login failed. Please try again."
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
    <div className="login-wrapper">
      {errorMessage && <div className="error-popup show">{errorMessage}</div>}
      {successMessage && (
        <div className="success-popup show">{successMessage}</div>
      )}
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="input-field1">
            <input
              type="text"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Enter your email</label>
          </div>
          <div className="input-field1">
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Enter your password</label>
          </div>
          <button type="submit">Log In</button>
          <div className="register">
            <p>
              Don't have an account? <a href="/signup">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
