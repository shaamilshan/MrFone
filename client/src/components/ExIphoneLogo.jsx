import React from "react";
import Logo from "../assets/Logo.png";

const ExIphoneLogo = ({ size = "h-16" }) => {
  return (
    <img src={Logo} alt="MrFone logo" className={`${size} w-auto`} />
  );
};

export default ExIphoneLogo;
