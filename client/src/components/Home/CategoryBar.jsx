import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

// Component
const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/categories`, config);
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
  return (
    <div className="relative bg-white p-2">
      {/* Gradient Overlay to indicate more items */}
      <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>

      {/* Scrollable Category List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE & Edge
          }}
        >
          <style>
            {`
              div::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
              }
            `}
          </style>

          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/collections?category=${category._id}`}
              className="flex flex-col items-center justify-center bg-white rounded-lg min-w-[100px] h-24 p-2 hover:shadow-lg transition duration-200"
            >
              {category.imgURL ? (
                <img
                  src={`${URL}/img/${category.imgURL}`}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-md flex items-center justify-center ${category.imgURL ? 'hidden' : 'flex'}`}
              >
                <span className="text-xl font-bold text-gray-400">{category.name.charAt(0)}</span>
              </div>
              <span className="text-xs font-medium text-gray-700 mt-1 text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
