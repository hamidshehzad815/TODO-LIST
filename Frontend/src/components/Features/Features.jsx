// src/components/Features/Features.jsx

import React from "react";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: "#4A90E2",
      title: "Task Management",
      description: "Organize and track tasks efficiently",
    },
    {
      icon: "#45B7AF",
      title: "Collaboration",
      description: "Work together seamlessly",
    },
    // {
    //   icon: "#FF7676",
    //   title: "Analytics",
    //   description: "Track team performance",
    // },
  ];

  return (
    <section className="features">
      <h2>Key Features</h2>
      <div className="feature-cards">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div
              className="feature-icon"
              style={{ background: feature.icon }}
            ></div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
