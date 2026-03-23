import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

const ShopCategories = () => {
  const scrollContainerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/categories`, config);
      console.log("Categories loaded:", data.categories);
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error loading categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,  // Animation happens only once
      mirror: false,
      anchorPlacement: "bottom-top",
    });
    AOS.refresh();
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
    <div className="relative bg-white mt-10 py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 px-6 mb-8 text-center">
        Explore Categories
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-6 py-6"
          style={{ 
            scrollBehavior: "smooth",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {categories.map((category, index) => (
            <Link
              key={category._id}
              to={`/collections?category=${category._id}`}
              className="relative flex-shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] h-[500px] md:h-[600px] group overflow-hidden rounded-xl md:rounded-2xl"
              style={{ flex: "0 0 auto" }}
            >
              {/* Full-bleed Background Image */}
              {category.imgURL ? (
                <img 
                  src={`${URL}/img/${category.imgURL}`} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    console.log("Image failed to load:", `${URL}/img/${category.imgURL}`);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback gradient background */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 ${category.imgURL ? 'hidden' : 'flex'}`}
              >
                <span className="text-9xl font-bold text-white/20 self-center">{category.name.charAt(0)}</span>
              </div>

              {/* Subtle dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500"></div>

              {/* Centered Category Title */}
              <div className="absolute inset-0 flex items-end justify-start p-8 md:p-12">
                <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {category.name}
                </h3>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
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
