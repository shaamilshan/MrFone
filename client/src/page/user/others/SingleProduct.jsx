import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronRight, Heart, Minus, Plus, ShoppingBag, Zap } from "lucide-react";
import ProductCard2 from "@/components/Cards/ProductCard2";
import ProductSlider from "@/components/Others/ProductSlider";
import JustLoading from "@/components/JustLoading";
import Quantity from "../components/Quantity";
import DescReview from "../components/DescReview";
import { URL } from "@/Common/api";
import { addToWishlist } from "@/redux/actions/user/wishlistActions";
import { config } from "@/Common/configurations";
import { addToBuyNowStore } from "@/redux/reducers/user/buyNowSlice";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import { useMediaQuery } from "react-responsive";
import "./singleproduct.css";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [currentImage, setCurrentImage] = useState("");
  const {   
    userProducts,
    loadingproducts,
    errorproducts,
    totalAvailableProducts,
  } = useSelector((state) => state.userProducts);
  const [searchParams, setSearchParams] = useSearchParams();

  const [variantPrice, setVariantPrice] = useState(null);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [toggleStates, setToggleStates] = useState({
    div1: false,
    div2: false,
    div3: false,
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const filteredProducts = userProducts?.filter(
    (product) => product._id !== id 
    );
    
    const loadProduct = async () => {
      setLoading(true);
      try {
      const { data } = await axios.get(`${URL}/user/product/${id}`, {
        withCredentials: true,
      });
      if (data) {
        setProduct(data.product);
        setLoading(false);
        setCurrentImage(data.product.imageURL);
        
        const defaultAttributes = {};
        
        const hasMultiAttributes = data.product.attributes?.some(attr => attr.combination && attr.combination.trim() !== '');
        
        if (hasMultiAttributes && data.product.attributes.length > 0) {
          const firstAvailableVariant = data.product.attributes.find(attr => attr.quantity > 0);
          
          if (firstAvailableVariant && firstAvailableVariant.combination) {
            const parts = firstAvailableVariant.combination.split(',');
            parts.forEach(part => {
              const [type, value] = part.split(':');
              defaultAttributes[type] = value;
            });
          }
        } else {
          const groupedAttributes = groupAttributes(data.product.attributes);
          
          Object.entries(groupedAttributes).forEach(([name, values]) => {
            const availableValue = values.find((attr) => attr.quantity > 0);
            if (availableValue) {
              defaultAttributes[name] = availableValue.value;
            }
          });
        }

        setSelectedAttributes(defaultAttributes);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(getUserProducts(searchParams));
    loadProduct();
  }, [id]);

  useEffect(() => {
  if (!product.attributes || Object.keys(selectedAttributes).length === 0) return;

  let price = null;

  const selectedAttributeValues = Object.entries(selectedAttributes);
  for (const [name, value] of selectedAttributeValues) {
    const match = product.attributes.find(
      (attr) => attr.name === name && attr.value === value && attr.price
    );
    if (match) {
      price = match.price;
    }
  }

  setVariantPrice(price);
}, [selectedAttributes, product]);


  const { user } = useSelector((state) => state.user);

  const notifyManager = async (productid, name = "NA", value = "NA") => {
    try {
      const userConfirmed = window.confirm(
        `Request for ${name} : ${value} product ${product.name} `
      );
      if (userConfirmed) {
        await axios.get(`${URL}/manager/notify/${id}/${name}/${value}`, config);
        toast.success(`Notified `);
      }
    } catch (error) {
      const err = error.response.data.error;
      toast.error(err);
    }
  };

  const getSelectedAttributeQuantity = () => {
    if (!product.attributes || Object.keys(selectedAttributes).length === 0) {
      return 0;
    }

    const hasMultiAttributes = product.attributes.some(attr => attr.combination && attr.combination.trim() !== '');

    if (hasMultiAttributes) {
      const selectedParts = Object.entries(selectedAttributes)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}:${value}`)
        .sort();
      
      const matchingVariant = product.attributes.find(attr => {
        if (!attr.combination) return false;
        const attrParts = attr.combination.split(',').sort();
        return selectedParts.every(part => attrParts.includes(part));
      });

      return matchingVariant ? matchingVariant.quantity : 0;
    } else {
      let minQuantity = Infinity;

      Object.entries(selectedAttributes).forEach(
        ([attributeName, selectedValue]) => {
          const matchingAttribute = product.attributes.find(
            (attr) => attr.name === attributeName && attr.value === selectedValue
          );
          if (matchingAttribute) {
            minQuantity = Math.min(minQuantity, matchingAttribute.quantity);
          }
        }
      );

      return minQuantity === Infinity ? 0 : minQuantity;
    }
  };

  const validateAttributesSelection = () => {
    if (!product.attributes) return true;

    const requiredAttributes = [
      ...new Set(product.attributes.map((attr) => attr.name)),
    ];

    for (const attributeName of requiredAttributes) {
      if (!selectedAttributes[attributeName]) {
        return false;
      }
    }
    return true;
  };

  const isCurrentSelectionAvailable = () => {
    return getSelectedAttributeQuantity() > 0;
  };

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product || !id) {
      toast.error("Product data is not available. Please refresh the page.");
      return;
    }

    if (!validateAttributesSelection()) {
      toast.error("Please select a value for each attribute.");
      return;
    }

    if (!isCurrentSelectionAvailable()) {
      toast.error("Selected combination is out of stock.");
      return;
    }

    setCartLoading(true);
    try {
      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: count,
          attributes: selectedAttributes,
        },
        { ...config, withCredentials:true}
      );
      toast.success("Added to cart");
    } catch (error) {
      const err = error.response?.data?.error || "Failed to add to cart";
      toast.error(err);
    }
    setCartLoading(false);
  };

  const buyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product || !id) {
      toast.error("Product data is not available. Please refresh the page.");
      return;
    }

    if (!validateAttributesSelection()) {
      toast.error("Please select a value for each attribute.");
      return;
    }

    if (!isCurrentSelectionAvailable()) {
      toast.error("Selected combination is out of stock.");
      return;
    }

    setCartLoading(true);
    try {
      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: count,
          attributes: selectedAttributes,
        },
        { ...config, withCredentials: true }
      );
      navigate("/cart");
    } catch (error) {
      const err = error.response?.data?.error || "Failed to process order";
      toast.error(err);
    }
    setCartLoading(false);
  };

  const { wishlist } = useSelector((state) => state.wishlist);
  const isProductInWishlist = wishlist.some((item) => item.product._id === id);

  const groupAttributes = (attributes, filterBySelected = false) => {
    if (!attributes || !Array.isArray(attributes) || attributes.length === 0) return {};
    
    const hasMultiAttributes = attributes.some(attr => attr && attr.combination && attr.combination.trim() !== '');
    
    if (hasMultiAttributes) {
      const grouped = {};
      
      attributes.forEach(attr => {
        if (!attr || !attr.combination) return;
        
        if (filterBySelected && Object.keys(selectedAttributes).length > 0) {
          const parts = attr.combination.split(',');
          const attrMap = {};
          parts.forEach(part => {
            if (!part) return;
            const [type, value] = part.split(':');
            if (type && value) attrMap[type] = value;
          });
          
          let matches = true;
          for (const [selectedType, selectedValue] of Object.entries(selectedAttributes)) {
            if (selectedValue && attrMap[selectedType] && attrMap[selectedType] !== selectedValue) {
              matches = false;
              break;
            }
          }
          
          if (!matches) return;
        }
        
        const parts = attr.combination.split(',');
        parts.forEach(part => {
          if (!part) return;
          const [type, value] = part.split(':');
          if (!type || !value) return;
          
          if (!grouped[type]) {
            grouped[type] = [];
          }
          
          const existing = grouped[type].find(item => item.value === value);
          if (!existing) {
            let matchingVariants;
            if (filterBySelected && Object.keys(selectedAttributes).length > 0) {
              matchingVariants = attributes.filter(a => {
                if (!a || !a.combination) return false;
                const aParts = a.combination.split(',');
                const aMap = {};
                aParts.forEach(p => {
                  if (!p) return;
                  const [t, v] = p.split(':');
                  if (t && v) aMap[t] = v;
                });
                
                if (aMap[type] !== value) return false;
                
                for (const [selectedType, selectedValue] of Object.entries(selectedAttributes)) {
                  if (selectedType !== type && selectedValue && aMap[selectedType] && aMap[selectedType] !== selectedValue) {
                    return false;
                  }
                }
                return true;
              });
            } else {
              matchingVariants = attributes.filter(a => 
                a && a.combination && a.combination.includes(`${type}:${value}`)
              );
            }
            
            const maxQuantity = matchingVariants.length > 0 ? Math.max(...matchingVariants.map(v => v.quantity || 0)) : 0;
            
            grouped[type].push({
              value: value,
              imageIndex: attr.imageIndex,
              quantity: maxQuantity,
            });
          }
        });
      });
      
      return grouped;
    } else {
      return attributes.reduce((acc, attribute) => {
        if (!attribute) return acc;
        acc[attribute.name] = acc[attribute.name] || [];
        acc[attribute.name].push({
          value: attribute.value,
          imageIndex: attribute.imageIndex,
          quantity: attribute.quantity,
        });
        return acc;
      }, {});
    }
  };

  const handleSelectAttribute = (attributeName, value) => {
    const attribute = product.attributes.find(
      (attr) => attr.name === attributeName && attr.value === value
    );

    if (attribute && attribute.quantity <= 0) {
      return;
    }

    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value === prev[attributeName] ? null : value,
    }));

    const selectedAttribute = product.attributes.find(
      (attr) => attr.name === attributeName && attr.value === value
    );

    if (selectedAttribute) {
      const imageIndex = selectedAttribute.imageIndex;
      if (imageIndex !== undefined) {
        setSelectedImageIndex(imageIndex);
      }
    }
  };

  // Build a cleaned array of image file names/paths and filter out any falsy values
  const imageArray = [product.imageURL, ...(product.moreImageURL || [])].filter(Boolean);

  const isEntireProductOutOfStock = () => {
    if (!product.attributes || product.attributes.length === 0) {
      return product.stockQuantity <= 0;
    }
    return product.attributes.every((attr) => attr.quantity <= 0);
  };

  const currentSelectionAvailable = isCurrentSelectionAvailable();
  const entireProductOutOfStock = isEntireProductOutOfStock();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const finalPrice = variantPrice
    ? parseInt(variantPrice)
    : Math.round(product.price - product.price * (product.offer / 100));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <JustLoading size={10} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Bottom Bar */}
      {isMobile && (
        <div className="fixed-bottom-panel">
          <button
            className="buy-now-btn"
            onClick={
              entireProductOutOfStock
                ? () => notifyManager(product._id)
                : buyNow
            }
            disabled={
              cartLoading ||
              (!entireProductOutOfStock && !currentSelectionAvailable)
            }
          >
            {cartLoading
              ? "Processing..."
              : entireProductOutOfStock
              ? "Notify Me"
              : !currentSelectionAvailable
              ? "Unavailable"
              : "Buy Now"}
          </button>
          <button
            className="wishlist-btn"
            onClick={addToCart}
            disabled={
              !entireProductOutOfStock && !currentSelectionAvailable
            }
          >
            {!currentSelectionAvailable
              ? "Unavailable"
              : "Add to Cart"}
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <nav className="flex items-center gap-1.5 text-[13px] text-gray-400">
          <button onClick={() => navigate("/")} className="hover:text-black transition-colors">Home</button>
          <ChevronRight size={14} />
          {product.category && (
            <>
              <button onClick={() => navigate(`/collections?category=${product.category._id}`)} className="hover:text-black transition-colors">
                {product.category.name}
              </button>
              <ChevronRight size={14} />
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Product Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Image Gallery — Left */}
          <div className="w-full lg:w-[55%]">
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center mb-4">
                {/* Pass fully-qualified image URLs to the slider to avoid double-prefixing or undefined values */}
                <ProductSlider
                  images={imageArray.map((img) => (img ? `${URL}/img/${img}` : ""))}
                  selectedImageIndex={selectedImageIndex}
                  onSelectImage={setSelectedImageIndex}
                />
              </div>
            </div>
          </div>

          {/* Product Info — Right */}
          <div className="w-full lg:w-[45%] lg:pt-4">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                {product.category.name}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-black' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-400 font-medium">{product.rating}</span>
              </div>
            )}

            {/* Price Block */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-3xl md:text-4xl font-black text-gray-900">
                ₹{finalPrice?.toLocaleString()}
              </span>
              {product.offer > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    {parseInt(product.offer)}% off
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Attributes Selection */}
            {product.attributes && (
              <div className="space-y-6 mb-8">
                {Object.entries(groupAttributes(product.attributes, false)).map(
                  ([name, values], index) => (
                    <div key={index}>
                      <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                        {name}
                        {selectedAttributes[name] && (
                          <span className="ml-2 text-gray-900 normal-case tracking-normal text-[13px]">
                            — {selectedAttributes[name]}
                          </span>
                        )}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {values.map(
                          ({ value, imageIndex, quantity }, valueIndex) => (
                            <button
                              key={valueIndex}
                              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                                ${
                                  selectedAttributes[name] === value
                                    ? "bg-black text-white shadow-md"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-black"
                                }
                                ${
                                  quantity <= 0
                                    ? "!bg-gray-50 !text-gray-300 !border-gray-100 cursor-not-allowed line-through"
                                    : "cursor-pointer active:scale-95"
                                }
                              `}
                              onClick={() =>
                                quantity > 0
                                  ? handleSelectAttribute(name, value)
                                  : notifyManager(product._id, name, value)
                              }
                              disabled={quantity <= 0}
                            >
                              {value}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Stock Status */}
            {!entireProductOutOfStock && (
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${currentSelectionAvailable ? "bg-green-500" : "bg-red-400"}`} />
                <span className="text-[13px] font-medium text-gray-500">
                  {currentSelectionAvailable
                    ? `${getSelectedAttributeQuantity()} in stock`
                    : "Selected combination unavailable"}
                </span>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-gray-400">Qty</span>
                <Quantity
                  count={count}
                  setCount={setCount}
                  maxQuantity={getSelectedAttributeQuantity()}
                />
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex gap-3 pt-2">
                {!entireProductOutOfStock ? (
                  <>
                    <button
                      onClick={buyNow}
                      disabled={!currentSelectionAvailable || cartLoading}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] ${
                        !currentSelectionAvailable || cartLoading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <Zap size={18} />
                      {cartLoading ? "Processing..." : !currentSelectionAvailable ? "Unavailable" : "Buy Now"}
                    </button>
                    <button
                      onClick={addToCart}
                      disabled={!currentSelectionAvailable || cartLoading}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-[0.98] ${
                        !currentSelectionAvailable || cartLoading
                          ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                          : "bg-white text-black border-gray-200 hover:border-black"
                      }`}
                    >
                      <ShoppingBag size={18} />
                      {!currentSelectionAvailable ? "Unavailable" : "Add to Cart"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => notifyManager(product._id)}
                    disabled={cartLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-black transition-all duration-200 active:scale-[0.98]"
                  >
                    <Bell size={18} />
                    {cartLoading ? "Processing..." : "Notify Me When Available"}
                  </button>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error("Please login to add to wishlist");
                      navigate("/login");
                      return;
                    }
                    dispatch(addToWishlist(id));
                  }}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-90 ${
                    isProductInWishlist
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black"
                  }`}
                >
                  {isProductInWishlist ? (
                    <AiFillHeart size={22} />
                  ) : (
                    <AiOutlineHeart size={22} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews / Description */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <DescReview product={product} id={product._id} />
      </div>

      {/* Recommended Products */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">
            More to Explore
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            You May Also Like
          </h2>
        </div>
        {loadingproducts ? (
          <div className="flex justify-center items-center h-60">
            <JustLoading size={10} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts
                .slice(0, 4)
                .map((pro, index) => (
                  <ProductCard2
                    star={true}
                    product={pro}
                    key={pro._id || index}
                  />
                ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">Nothing to show</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
