import React, { useEffect } from "react";
import airpodsImg from "../../assets/trendskart/categories/airpodss.jpeg";
import smwatchImg from "../../assets/trendskart/categories/smartwatches.jpeg";
import AOS from "aos";
import "aos/dist/aos.css";

function BestSeller() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false, 
      mirror: false, 
      anchorPlacement: "bottom-top",
    });
  
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }, []);
  

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full px-6 md:px-10">
      <div
        data-aos="fade-right"
        data-aos-delay="400"
        className="flex justify-center items-center w-full md:w-1/2 mt-6 md:mt-10 bg-gray-50 p-5 shadow-md"
      >
        <img
          className="w-3/4 h-56 md:h-[350px] object-contain"
          src={smwatchImg}
          alt="Smart Watch"
        />
      </div>
      <div
        data-aos="fade-left"
        className="flex justify-center items-center w-full md:w-1/2 mt-6 md:mt-10 bg-gray-50  p-5 shadow-md"
      >
        <img
          className="w-3/4 h-56 md:h-[350px] object-contain"
          src={airpodsImg}
          alt="AirPods" 
        />
      </div>
    </div>
  );
}

export default BestSeller;
