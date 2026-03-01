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
    <div className="relative bg-white mt-10 py-6">
      <h2 className="text-2xl font-semibold text-gray-800 px-6">
        Trending Categories
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
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
              key={category._id}
              to={`/collections?category=${category._id}`}
              className="flex flex-col items-center justify-center bg-white rounded-lg w-40 h-40 p-4 shadow-md hover:shadow-lg transition duration-200"
              style={{ flex: "0 0 auto" }}
            >
              {category.imgURL ? (
                <img 
                  src={`${URL}/img/${category.imgURL}`} 
                  alt={category.name} 
                  className="w-24 h-24 object-contain rounded-md"
                  onError={(e) => {
                    console.log("Image failed to load:", `${URL}/img/${category.imgURL}`);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md flex items-center justify-center ${category.imgURL ? 'hidden' : 'flex'}`}
              >
                <span className="text-3xl font-bold text-gray-400">{category.name.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 mt-2 text-center">{category.name}</span>
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
