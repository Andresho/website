import React from "react";
import HeroSection from "../../components/HeroSection";
import Cards from "../../components/Cards";
import { homeObjOne } from "./Data";

function About() {
  return (
    <>
      <Cards />
      <HeroSection {...homeObjOne} />
    </>
  );
}

export default About;
