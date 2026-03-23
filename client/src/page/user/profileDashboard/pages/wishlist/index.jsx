import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, Tag, Package } from "lucide-react";
import axios from "axios";
import {
  getWishlist,
  deleteEntireWishlist,
  deleteOneProductFromWishlist,
} from "../../../../../redux/actions/user/wishlistActions";
import { URL } from "../../../../../Common/api";
import { config } from "../../../../../Common/configurations";
import toast from "react-hot-toast";
import JustLoading from "../../../../../components/JustLoading";
import ConfirmModel from "../../../../../components/ConfirmModal";

const WishList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const [cartLoading, setCartLoading] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const clearWishlist = () => {
    dispatch(deleteEntireWishlist());
    setShowConfirm(false);
  };

  const removeFromWishlist = (productId) => {
    dispatch(deleteOneProductFromWishlist(productId));
    toast.success("Removed from wishlist");
  };

  const addToCart = async (productId) => {
    setCartLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      await axios.post(
        `${URL}/user/cart`,
        {
          product: productId,
          quantity: 1,
        },
        { ...config, withCredentials: true }
      );
      toast.success("Added to cart");
      // Optionally remove from wishlist after adding to cart
      // dispatch(deleteOneProductFromWishlist(productId));
    } catch (error) {
      const err = error.response?.data?.error || "Failed to add to cart";
      toast.error(err);
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const getStockStatus = (product) => {
    if (product.status === "published") {
      return { text: "In Stock", color: "text-green-600", available: true };
    } else if (product.status === "low quantity") {
      return { text: "Low Stock", color: "text-orange-600", available: true };
    } else {
      return { text: "Out of Stock", color: "text-red-600", available: false };
    }
  };

  const calculateDiscount = (product) => {
    if (product.offer > 0) {
      const originalPrice = Math.round(product.price / (1 - product.offer / 100));
      return originalPrice;
    }
    return null;
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModel
          title="Clear entire wishlist?"
          positiveAction={clearWishlist}
          negativeAction={() => setShowConfirm(false)}
        />
      )}

      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Saved for Later
              </h1>
              <p className="text-sm text-gray-500">
                Your curated collection of premium devices
              </p>
            </div>
            {wishlist && wishlist.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
                </p>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center">
            <JustLoading size={10} />
          </div>
        ) : wishlist && wishlist.length > 0 ? (
          <div className="space-y-6">
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {wishlist.map((item) => {
                const product = item.product;
                const stockStatus = getStockStatus(product);
                const originalPrice = calculateDiscount(product);
                const productPrice = product.price + (product.markup || 0);

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all group relative border border-gray-100"
                  >
                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>

                    {/* Price Reduced Badge */}
                    {product.offer > 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                        Sale
                      </div>
                    )}

                    {/* Product Image */}
                    <div
                      className="aspect-square bg-gray-50 p-4 cursor-pointer flex items-center justify-center overflow-hidden"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.imageURL ? (
                        <img
                          src={`${URL}/img/${product.imageURL}`}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-gray-300" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <h3
                        className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors h-10"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        {product.name}
                      </h3>

                      {/* Attributes */}
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                          {Object.entries(item.attributes).map(([key, value], idx) => (
                            <span key={idx}>
                              {value}
                              {idx < Object.entries(item.attributes).length - 1 && " • "}
                            </span>
                          ))}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold text-gray-900">
                            ₹{productPrice.toLocaleString()}
                          </span>
                          {originalPrice && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{originalPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">
                                {Math.round(product.offer)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="mb-3">
                        <span className={`text-xs font-semibold ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => addToCart(product._id)}
                          disabled={!stockStatus.available || cartLoading[product._id]}
                          className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          {cartLoading[product._id] ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              Add to Cart
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="w-full text-gray-500 hover:text-red-600 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Save items you love to buy them later
              </p>
              <button
                onClick={() => navigate("/collections")}
                className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WishList;
