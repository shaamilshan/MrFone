import { URL } from "@/Common/api";
import React from "react";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating = 5 }) => {
  return (
    <div className="flex items-center  justify-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${
            index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  // Calculate original price for discount display
  const originalPrice = product.offer
    ? Math.round(product.price / (1 - product.offer / 100))
    : null;
    
  // Calculate discount percentage correctly



  // const discountPercentage = product.offer && originalPrice 
  //   ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
  //   : 0;
console.log(product.rating)

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer bg-white rounded-lg shadow-md transition-all duration-300 p-4"
    >
      {/* Image container with centered product image */}
      <div className="flex items-center justify-center h-40 mb-3 ">
        <img
          src={`${URL}/img/${product?.imageURL}`}
          alt={product.name}
          className="h-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      {/* Rating stars */}
      <StarRating  rating={product.rating || 4 } />
      
      {/* Product name */}
      <h3 className="text-sm text-gray-700 mt-1 font-semibold mb-2 line-clamp-2 items-center flex justify-center">
        {product.name}
      </h3>
      
      {/* Price section */}
      <div className="flex items-center flex-wrap gap-2 justify-center">
        {/* Current price in red */}
        <span className="text-sm font-medium text-red-500">
          ₹{product.price.toLocaleString()}
        </span>
        
        {/* Original price with strikethrough if there's an offer */}
        {originalPrice && (
          <span className="text-xs text-gray-400 line-through">
            {/* ₹{originalPrice.toLocaleString()} */}
          </span>
        )}
        
        {/* Discount percentage badge - only show if there's an offer */}
        {/* {discountPercentage > 0 && ( */}
          <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">
            {/* {discountPercentage}% Off */} 50% off
          </span>
        {/* )} */}
      </div>
    </div>
  );
};

export default ProductCard;