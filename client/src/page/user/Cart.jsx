import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Package, Shield, CreditCard } from "lucide-react";
import axios from "axios";
import {
  getCart,
  deleteEntireCart,
  deleteOneProduct,
  applyCoupon,
  incrementCount,
  decrementCount,
} from "../../redux/actions/user/cartActions";
import { calculateTotalPrice } from "../../redux/reducers/user/cartSlice";
import ConfirmModel from "../../components/ConfirmModal";
import toast from "react-hot-toast";
import JustLoading from "../../components/JustLoading";
import { URL } from "../../Common/api";
import { config } from "../../Common/configurations";
import EmptyCart from "../../assets/emptyCart.png";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error, cartId, couponCode, totalPrice, shipping, discount, couponType, countLoading } = useSelector(
    (state) => state.cart
  );

  const [inputCouponCode, setInputCouponCode] = useState("");
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  // Fetching entire cart on page load
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Fetch recommended products based on cart items
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (cart.length === 0) return;
      
      setLoadingRecommended(true);
      try {
        // Get categories from cart items
        const categories = [...new Set(cart.map(item => item.product.category).filter(Boolean))];
        
        // Fetch products from the same categories
        const { data } = await axios.get(`${URL}/user/products?limit=8`, config);
        
        // Filter out products already in cart and limit to 4
        const cartProductIds = cart.map(item => item.product._id);
        const filtered = data.products
          .filter(product => !cartProductIds.includes(product._id))
          .slice(0, 4);
        
        setRecommendedProducts(filtered);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedProducts();
  }, [cart]);

  // Calculating the total with the data and updating it when ever there is a change
  useEffect(() => {
    dispatch(calculateTotalPrice());
    setInputCouponCode(couponCode);
  }, [cart, dispatch, couponCode]);

  // Applying coupon to cart
  const dispatchApplyCoupon = () => {
    if (inputCouponCode.trim() !== "") {
      dispatch(applyCoupon(inputCouponCode.trim()));
    }
  };

  // Deleting entire cart
  const deleteCart = () => {
    toggleConfirm();
    dispatch(deleteEntireCart(cartId));
  };

  // Modal for deleting entire cart
  const [showConfirm, setShowConfirm] = useState(false);
  const toggleConfirm = () => {
    if (cart.length > 0) {
      setShowConfirm(!showConfirm);
    } else {
      toast.error("Nothing in the cart");
    }
  };

  // Deleting one product
  const [productId, setProductId] = useState("");
  const dispatchDeleteProduct = () => {
    dispatch(deleteOneProduct({ cartId, productId }));
    toggleProductConfirm("");
  };

  // Modal for deleting one product from cart
  const [showProductConfirm, setShowProductConfirm] = useState(false);
  const toggleProductConfirm = (id) => {
    setProductId(id);
    setShowProductConfirm(!showProductConfirm);
  };

  const dispatchIncrement = (item) => {
    dispatch(
      incrementCount({
        cartId,
        productId: item.product._id,
        attributes: item.attributes,
        productdata: item.product,
        quantity: item.quantity,
      })
    );
  };

  const dispatchDecrement = (item) => {
    dispatch(decrementCount({ cartId, productId: item.product._id }));
  };

  // Calculate totals
  const tax = 0;
  let offer = 0;
  if (couponType === "percentage") {
    offer = (totalPrice * discount) / 100;
  } else {
    offer = discount;
  }
  const estimatedTax = (totalPrice * 0.18).toFixed(2); // 18% tax as shown in image
  const finalTotal = totalPrice + shipping + parseInt(tax) - offer;

  // Add recommended product to cart
  const addRecommendedToCart = async (productId) => {
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
      dispatch(getCart());
    } catch (error) {
      const err = error.response?.data?.error || "Failed to add to cart";
      toast.error(err);
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModel
          title="Confirm Clearing Cart?"
          positiveAction={deleteCart}
          negativeAction={toggleConfirm}
        />
      )}
      {showProductConfirm && (
        <ConfirmModel
          title="Confirm Delete?"
          positiveAction={dispatchDeleteProduct}
          negativeAction={() => toggleProductConfirm("")}
        />
      )}

      {cart.length > 0 ? (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center">
                Your Bag
              </h1>
              <p className="text-center text-gray-500 mt-3 text-sm">
                Review your selected products before checkout. Enjoy free delivery on all Apple products.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2 space-y-4">
                {loading ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 flex justify-center">
                    <JustLoading size={10} />
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div
                          className="w-24 h-24 shrink-0 cursor-pointer"
                          onClick={() => navigate(`/product/${item.product._id}`)}
                        >
                          {item.product.imageURL ? (
                            <img
                              src={`${URL}/img/${item.product.imageURL}`}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                              <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3
                                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                                onClick={() => navigate(`/product/${item.product._id}`)}
                              >
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.attributes &&
                                  Object.entries(item.attributes).map(([key, value], idx) => (
                                    <span key={idx}>
                                      {value}
                                      {idx < Object.entries(item.attributes).length - 1 && ", "}
                                    </span>
                                  ))}
                              </p>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{(item.product.price + item.product.markup).toLocaleString()}.00
                            </p>
                          </div>

                          {/* Stock Status */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 font-medium">
                              In Stock & Ready to ship
                            </span>
                          </div>

                          {/* Quantity Controls and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Quantity */}
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => dispatchDecrement(item)}
                                  disabled={countLoading || item.quantity <= 1}
                                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => dispatchIncrement(item)}
                                  disabled={countLoading}
                                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Edit Button */}
                              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Edit
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => toggleProductConfirm(item.product._id)}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Summary</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">₹{totalPrice.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-medium">
                        {shipping === 0 ? "Free" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated Tax</span>
                      <span className="text-gray-900 font-medium">₹{estimatedTax}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600 font-medium">
                          -₹{offer.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-900 font-medium">Total</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{finalTotal.toLocaleString()}.06
                      </span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputCouponCode}
                        onChange={(e) => setInputCouponCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <button
                        onClick={dispatchApplyCoupon}
                        className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg text-sm transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponCode && (
                      <div className="mt-2 text-xs text-green-600 font-medium">
                        ✓ Coupon "{couponCode}" applied
                      </div>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      if (cart.length > 0) {
                        navigate("/checkout");
                      } else {
                        toast.error("No product in cart");
                      }
                    }}
                    className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={() => navigate("/collections")}
                    className="w-full text-blue-600 hover:text-blue-700 py-2 text-sm font-medium"
                  >
                    Continue Shopping
                  </button>

                  {/* Delivery Estimate */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Arrives Thu, Oct 24 — Fri, Oct 25 to 10001 New York
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Icons */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <ShoppingBag className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Shield className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <p className="text-xs text-center text-gray-400 mt-6">
                    Secure checkout with 256-bit encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          <div className="max-w-7xl mx-auto px-4 pb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">You May Also Like</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Curated accessories for your new setup.
                </p>
              </div>
            </div>

            {/* Dynamic recommended products */}
            {loadingRecommended ? (
              <div className="flex justify-center py-12">
                <JustLoading size={8} />
              </div>
            ) : recommendedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.imageURL ? (
                        <img
                          src={`${URL}/img/${product.imageURL}`}
                          alt={product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      ) : (
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    <h3 
                      className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                      {product.category?.name || "Accessories"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        ₹{(product.price + (product.markup || 0)).toLocaleString()}.00
                      </span>
                      <button 
                        onClick={() => addRecommendedToCart(product._id)}
                        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No recommendations available</p>
              </div>
            )}
          </div>

          {/* Footer Banner */}
          <div className="bg-gray-100 border-t border-gray-200 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Experience Perfection
              </p>
              <p className="text-xs text-gray-400 mt-2">
                © 2024 Apple Reseller. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="flex flex-col items-center">
            <img
              src={EmptyCart}
              alt="Empty Cart Icon"
              className="w-full lg:w-1/2 max-w-md"
            />
            <p className="text-gray-500 mt-4 text-lg">Your cart is empty</p>
            <Link
              to="/collections"
              className="mt-4 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
