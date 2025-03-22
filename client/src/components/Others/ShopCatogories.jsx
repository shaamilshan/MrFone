import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import sneakerImg from "../../assets/trendskart/categories/sneakers.jpeg";
import airpodsImg from "../../assets/trendskart/categories/airpodss.jpeg";
import smwatchImg from "../../assets/trendskart/categories/smartwatches.jpeg";
import crocsImg from "../../assets/trendskart/categories/crocs.jpeg";
import chappelImg from "../../assets/trendskart/categories/chappel.jpeg";
import gadgetsImg from "../../assets/trendskart/categories/gadgets.jpeg";
import sunglassesImg from "../../assets/trendskart/categories/sunglasses.jpeg"; 
import watchesImg from "../../assets/trendskart/categories/watches.jpeg";

const categories = [
  { name: "Sneakers", id: "67497eb086528f9f86bbb8cf", image: sneakerImg },
  { name: "Airpods", id: "67497f8186528f9f86bbb920", image: airpodsImg },
  { name: "Smart Watches", id: "6749825b86528f9f86bbba2e", image: smwatchImg },
  { name: "Crocs", id: "674982e486528f9f86bbba50", image: crocsImg },
  { name: "Chappals", id: "6749851886528f9f86bbbaf2", image: chappelImg },
  { name: "Gadgets", id: "6749858586528f9f86bbbaf7", image: gadgetsImg },
  { name: "Sunglasses", id: "674986fd86528f9f86bbbb38", image: sunglassesImg },
  { name: "Watches", id: "6749876986528f9f86bbbb3c", image: watchesImg },
];

const ShopCategories = () => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,  // Allows animations to repeat when element comes into view again
      mirror: false, // Ensures animation resets when scrolling back
      anchorPlacement: "bottom-top", // Corrected spelling
    });
    AOS.refresh(); // Ensures elements are properly detected
  }, []);
  
  

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleWheelScroll = (event) => {
      if (container && event.deltaY !== 0) {
        event.preventDefault();
        container.scrollLeft += event.deltaY * 1.5; // Adjust speed as needed
      }
    };

    if (container) {
      container.addEventListener("wheel", handleWheelScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  return (
    <div className="relative bg-white mt-10 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 px-6" data-aos="fade-right">
        Trending Categories
      </h2>

      <div 
        ref={scrollContainerRef} 
        data-aos="fade-left"
        className="flex gap-6 overflow-x-auto scrollbar-hide px-6 py-4"
        style={{ 
          scrollBehavior: "smooth",
          overflowX: "auto",
          whiteSpace: "nowrap",
          width: "100%",
        }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/collections?category=${category.id}`}
            className="flex flex-col items-center justify-center bg-white rounded-lg w-40 h-40 p-4 shadow-md hover:shadow-lg transition duration-200"
            style={{ flex: "0 0 auto" }}
          >
            <img src={category.image} alt={category.name} className="w-24 h-24 object-contain rounded-md" />
            <span className="text-sm font-medium text-gray-700 mt-2">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopCategories;


// {
/* {categories.map((item, index) => {
        
        <li key={index}>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
            href={`/collections?category=${item._id}`}
          >
            {item.name}
          </Link>
        </li>;
      })} */
// }

/*
import React, { useEffect, useState } from "react";
import ProductCard3 from "../Cards/ProductCard3";
import axios from "axios";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

const ShopCategories = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const { data } = await axios.get(`${URL}/user/categories`, config);
    setCategories(data.categories);
    console.log(data.categories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="my-4 flex flex-col items-center w-full bg-[#CC4254] py-4 sm:rounded-[20px]">
      <h1 className="text-white text-[30px] my-6 text-center">
        Shop by Categories
      </h1>
      <div className="flex flex-wrap w-full items-center justify-center px-2">
        {categories.map((item, index) => {
          // Check if this is the last item and if there are 5 items
          const isLastItem =
            index === categories.length - 1 && categories.length % 2 !== 0;

          return (
            <div
              className={`p-2 ${
                isLastItem
                  ? "w-full pt-4 sm:pt-0 lg:w-1/5"
                  : "w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5"
              }`} // Last item takes full width if there are 5 items
              key={item._id}
            >
              <ProductCard3 item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopCategories;

{
  /* {categories.map((item, index) => {
        
        <li key={index}>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
            href={`/collections?category=${item._id}`}
          >
            {item.name}
          </Link>
        </li>;
      })} */
// }
