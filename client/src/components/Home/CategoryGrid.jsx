import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "@/Common/api";
import { config } from "@/Common/configurations";

const CategoryGrid = () => {
  const navigate = useNavigate();
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

  const handleCategoryClick = (categoryId) => {
    navigate(`/collections?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {categories.map((category) => (
        <div
          key={category._id}
          onClick={() => handleCategoryClick(category._id)}
          className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
        >
          {category.imgURL ? (
            <img
              src={`${URL}/img/${category.imgURL}`}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-400">{category.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <h2 className="text-white text-lg md:text-xl font-semibold">
              {category.name}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
