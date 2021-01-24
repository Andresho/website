import React from "react";
import HeroSection from "../../components/HeroSection";
import { homeObjOne, homeObjThree } from "./Data";
//import Pricing from "../../components/Pricing";

function Home() {
  return (
    <>
      <HeroSection {...homeObjOne} />
      <HeroSection {...homeObjThree} />
    </>
  );
}

export default Home;
//<Pricing />
