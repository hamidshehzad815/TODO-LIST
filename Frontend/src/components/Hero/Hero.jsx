// src/components/Hero/Hero.jsx

import React from "react";
import "./Hero.css";

const Hero = () => {
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
        <button className="btn btn-primary">Get Started Free</button>
        <button className="btn btn-outline">Watch Demo</button>
      </div>
    </section>
  );
};

export default Hero;
