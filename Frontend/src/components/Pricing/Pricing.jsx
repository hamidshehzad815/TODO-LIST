// src/components/Pricing/Pricing.jsx

import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Pricing.css";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      buttonText: "Get Started",
      buttonStyle: "outline",
    },
    // {
    //   name: "Pro",
    //   price: "$10",
    //   buttonText: "Choose Plan",
    //   buttonStyle: "primary",
    // },
    // {
    //   name: "Team",
    //   price: "$25",
    //   buttonText: "Choose Plan",
    //   buttonStyle: "outline",
    // },
  ];
  const navigate = useNavigate(); // Initialize navigate function

  const handleGetStartedClick = () => {
    navigate("/login"); // Navigate to /login on button click
  };
  return (
    <section className="pricing">
      <h2>Simple Pricing</h2>
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className="pricing-card">
            <h3>{plan.name}</h3>
            <div className="price">{plan.price}</div>
            <button
              className={`btn btn-${plan.buttonStyle}`}
              onClick={handleGetStartedClick}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
