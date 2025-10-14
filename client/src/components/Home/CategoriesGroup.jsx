import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

const CategoriesGroup = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColors = ["bg-gray-100", "bg-white", "bg-purple-50", "bg-green-50", "bg-blue-50", "bg-pink-50"];

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/categories`, config);
      // Take only first 4 categories for the grid layout
      const categoriesWithColors = data.categories.slice(0, 4).map((cat, index) => ({
        ...cat,
        bgColor: bgColors[index % bgColors.length]
      }));
      setCategories(categoriesWithColors);
      setLoading(false);
    } catch (error) {
      console.error("Error loading categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/collections?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-20 bg-black">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="py-8 px-4 sm:px-20 bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* First row: 1/4 and 3/4 width */}
        {categories.slice(0, 2).map((category, index) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`cursor-pointer ${
              index === 0
                ? "col-span-1 sm:col-span-1 md:col-span-1"
                : "col-span-1 sm:col-span-1 md:col-span-3"
            } ${category.bgColor} rounded-lg overflow-hidden transition-transform hover:scale-[1.02] group`}
          >
            <div className="relative w-full">
              <h2 className="absolute top-5 left-4 text-2xl font-bold text-black z-10 group-hover:scale-105 transition-transform duration-300">
                {category.name}
              </h2>
              <div className="relative overflow-hidden rounded-md h-64 w-full">
                {category.imgURL ? (
                  <img
                    src={`${URL}/img/${category.imgURL}`}
                    alt={`${category.name} category`}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-6xl font-bold text-gray-400">{category.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Second row: 3/4 and 1/4 width */}
        {categories.slice(2, 4).map((category, index) => (
          <div
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`cursor-pointer ${
              index === 0
                ? "col-span-1 sm:col-span-1 md:col-span-3"
                : "col-span-1 sm:col-span-1 md:col-span-1"
            } ${category.bgColor} rounded-lg overflow-hidden transition-transform hover:scale-[1.02] group`}
          >
            <div className="relative w-full">
              <h2 className="absolute top-5 left-4 text-2xl font-bold text-black z-10 group-hover:scale-105 transition-transform duration-300 sm:bottom-4 sm:left-4 md:top-4 md:left-4">
                {category.name}
              </h2>
              <div className="relative overflow-hidden rounded-md h-64 w-full">
                {category.imgURL ? (
                  <img
                    src={`${URL}/img/${category.imgURL}`}
                    alt={`${category.name} category`}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-6xl font-bold text-gray-400">{category.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGroup;
