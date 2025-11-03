"use client";

import React from "react";
import Hero from "../../components/Hero/Hero";
import WhyVisit from "../../components/WhyVisit/WhyVisit";
import Testimonials from "../../components/Testimonials/Testimonials";
import WhyChoose from "../../components/WhyChoose/WhyChoose";
import InsurancePayment from "../../components/InsurancePayment/InsurancePayment";
import DentalGame from "../../components/DentalGame/DentalGame";
import { useAuth } from "../../context/AuthContext";

const Home: React.FC = () => {
  const { isLoggedIn } = useAuth();
console.log("Usuario logueado:", isLoggedIn);
  return (
    <>
      <Hero />
      <WhyVisit />
      <Testimonials />
      <WhyChoose />
      <InsurancePayment />
      <DentalGame />
    </>
  );
};

export default Home;
