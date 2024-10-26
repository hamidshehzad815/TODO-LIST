// src/components/HomePage/HomePage.jsx

import React from "react";
import Header from "../Header/Header";
import Hero from "../Hero/Hero";
import Features from "../Features/Features";
import Pricing from "../Pricing/Pricing";
import Footer from "../Footer/Footer";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
};

export default HomePage;
