import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleGetStartedClick = () => {
    navigate("/login"); // Navigate to /login on button click
  };

  return (
    <section className="hero">
      <h1>
        Stay Organized,
        <br />
        Stay Productive
      </h1>
      <p>
        Streamline your tasks, collaborate seamlessly, and achieve more
        together.
      </p>
      <div className="hero-buttons">
        <button className="btn btn-primary" onClick={handleGetStartedClick}>
          Get Started Free
        </button>
      </div>
    </section>
  );
};

export default Hero;
