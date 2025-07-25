import React, { useEffect } from "react";
import airpodsImg from "../../assets/banner/15pro.jpg";
import smwatchImg from "../../assets/banner/12.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

function BestSeller() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
      mirror: false,
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full px-6 md:px-10">
      {/* Card 1: Smart Watch */}
      <div
        data-aos="fade-right"
        data-aos-delay="400"
        // --- Height increased here --- ✨
        className="w-full md:w-1/2 mt-6 md:mt-10 bg-gray-50 shadow-md h-80 md:h-[420px] overflow-hidden rounded-lg"
      >
        <img
          className="w-full h-full object-cover"
          src={smwatchImg}
          alt="Smart Watch"
        />
      </div>

      {/* Card 2: AirPods */}
      <div
        data-aos="fade-left"
        // --- Height increased here --- ✨
        className="w-full md:w-1/2 mt-6 md:mt-10 bg-gray-50 shadow-md h-80 md:h-[420px] overflow-hidden rounded-lg"
      >
        <img
          className="w-full h-full object-cover"
          src={airpodsImg}
          alt="AirPods"
        />
      </div>
    </div>
  );
}

export default BestSeller;