import { URL } from "@/Common/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../redux/actions/user/wishlistActions";
import axios from "axios";
import { config } from "../../Common/configurations";
import toast from "react-hot-toast";

const StarRating = ({ rating = 5 }) => {
  return (
    <div className="flex items-center gap-0.5 mb-2.5">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-[14px] w-[14px] ${
            index < Math.floor(rating) ? "text-black" : "text-gray-200"
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
  const dispatch = useDispatch();
  
  const [cartLoading, setCartLoading] = useState(false);

  const wishlistState = useSelector((state) => state.wishlist);
  const wishlist = wishlistState?.wishlist || [];
  const isProductInWishlist = wishlist.some((item) => item?.product?._id === product._id);
  
  // Get user from Redux state
  const { user } = useSelector((state) => state.user);

  // Calculate original price and discount correctly
  const originalPrice = product.offer
    ? Math.round(product.price / (1 - product.offer / 100))
    : null;
    
  const discountPercentage = product.offer || 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    
    if (isProductInWishlist) {
      toast("Already in wishlist", { icon: "❤️" });
    } else {
      dispatch(addToWishlist({ product: product._id }));
    }
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to add to cart");
      navigate("/login");
      return;
    }
    
    if (!product || !product._id) {
      toast.error("Product information is missing");
      return;
    }

    setCartLoading(true);
    try {
      const payload = {
        product: product._id,
        quantity: 1,
      };
      
      // Add attributes if product has them
      if (product.attributes && product.attributes.length > 0) {
        const defaultAttributes = {};
        const hasMultiAttributes = product.attributes.some(attr => attr.combination && attr.combination.trim() !== '');
        
        if (hasMultiAttributes) {
          const firstAvailableVariant = product.attributes.find(attr => attr.quantity > 0);
          if (firstAvailableVariant && firstAvailableVariant.combination) {
            const parts = firstAvailableVariant.combination.split(',');
            parts.forEach(part => {
              const [type, value] = part.split(':');
              if (type && value) defaultAttributes[type] = value;
            });
          }
        } else {
          product.attributes.forEach(attr => {
            if (attr && attr.name && attr.value) {
              defaultAttributes[attr.name] = attr.value;
            }
          });
        }
        
        if (Object.keys(defaultAttributes).length > 0) {
          payload.attributes = defaultAttributes;
        }
      }

      await axios.post(
        `${URL}/user/cart`,
        payload,
        { ...config, withCredentials: true }
      );
      toast.success("Added to cart");
    } catch (error) {
      const err = error.response?.data?.error || "Error adding to cart";
      toast.error(err);
    }
    setCartLoading(false);
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 w-full max-w-sm h-full flex flex-col overflow-hidden relative"
    >
      {/* Image container */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-50 flex-shrink-0 relative">
        <img
          src={`${URL}/img/${product?.imageURL}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
      
        <StarRating rating={product.rating || 4} />

        {/* Product name */}
        <h3 className="text-[15px] text-gray-900 font-extrabold line-clamp-2 leading-snug group-hover:text-black transition-colors">
          {product.name}
        </h3>
        
        {/* Product description */}
        {product.description && (
          <p className="text-[13px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        <div className="mt-auto pt-4 flex flex-col gap-3">
          {/* Price section */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-black text-black tracking-tight">
                ₹{product.price.toLocaleString()}
              </span>
              
              {originalPrice && (
                <span className="text-[13px] text-gray-400 font-medium line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Discount badge */}
            {product.offer > 0 && (
              <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-900 px-2 py-0.5 rounded-sm">
                -{Math.round(discountPercentage)}%
              </span>
            )}
          </div>
          
          {/* Action Buttons (Always Visible for Mobile) */}
          <div className="flex gap-2 mt-1">
            <button
               onClick={handleAddToCartClick}
               disabled={cartLoading}
               className="flex-1 bg-black text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-1.5 shadow-sm active:scale-95"
            >
               <ShoppingCart size={14} />
               {cartLoading ? "..." : "Add"}
            </button>
            <button 
              onClick={handleWishlistClick}
              className="px-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200 active:scale-95"
            >
              <Heart size={16} className={isProductInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;