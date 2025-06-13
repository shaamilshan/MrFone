import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Bell, HomeIcon, ShoppingCart, Zap } from "lucide-react";
import ProductCard2 from "@/components/Cards/ProductCard2";
import ProductSlider from "@/components/Others/ProductSlider";
import { IoMdStar } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import JustLoading from "@/components/JustLoading";
import ImageZoom from "@/components/ImageZoom";
import Quantity from "../components/Quantity";
import DescReview from "../components/DescReview";
import { URL } from "@/Common/api";
import { addToWishlist } from "@/redux/actions/user/wishlistActions";
import { config } from "@/Common/configurations";
import ProductDetailsStarAndRating from "../components/ProductDetailsStarAndRating";
import { addToBuyNowStore } from "@/redux/reducers/user/buyNowSlice";
import { getUserProducts } from "@/redux/actions/user/userProductActions";

import redbanner from "../../../assets/trendskart/home/red-banner.jpg";
import { FaShareAlt } from "react-icons/fa";
import "./singleproduct.css";
import { useMediaQuery } from "react-responsive";
import { BsSlash } from "react-icons/bs";

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
        console.log("data.product", data.product);
        setLoading(false);
        setCurrentImage(data.product.imageURL);
        // Set default selected attributes to the first available value of each attribute
        const defaultAttributes = {};
        const groupedAttributes = groupAttributes(data.product.attributes);

        Object.entries(groupedAttributes).forEach(([name, values]) => {
          // Find the first available (quantity > 0) value for each attribute
          const availableValue = values.find((attr) => attr.quantity > 0);
          if (availableValue) {
            defaultAttributes[name] = availableValue.value;
          }
        });

        setSelectedAttributes(defaultAttributes);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });

    dispatch(getUserProducts(searchParams));
    loadProduct();
  }, [id]);

  const { user } = useSelector((state) => state.user);

  const onHomeClick = async () => {
    navigate("/");
  };

  const onCategoryClick = async () => {
    navigate(`/collections?category=${product.category._id}`);
  };

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

  // Check if current selected combination is available
  const getSelectedAttributeQuantity = () => {
    if (!product.attributes || Object.keys(selectedAttributes).length === 0) {
      return 0;
    }

    // Find matching attributes for the current selection
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

  // Check if the current selection is available
  const isCurrentSelectionAvailable = () => {
    return getSelectedAttributeQuantity() > 0;
  };

  const addToCart = async () => {
    if (!user) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      navigate("/login");
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
        `${URL}/user/wishlist`,
        {
          product: id,
          quantity: count,
          attributes: selectedAttributes,
        },
        { ...config, withCredentials: true }
      );
      toast.success("Added to cart");
    } catch (error) {
      const err = error.response.data.error;
      toast.error(err);
    }
    setCartLoading(false);
  };

  const buyNow = async () => {
    if (!user) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      navigate("/login");
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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      const err = error.response.data.error;
      toast.error(err);
    }
    setCartLoading(false);
  };

  const { wishlist } = useSelector((state) => state.wishlist);
  const isProductInWishlist = wishlist.some((item) => item.product._id === id);

  const handleClick = (div) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [div]: !prevState[div],
    }));
  };

  const groupAttributes = (attributes) => {
    return attributes.reduce((acc, attribute) => {
      acc[attribute.name] = acc[attribute.name] || [];
      acc[attribute.name].push({
        value: attribute.value,
        imageIndex: attribute.imageIndex,
        quantity: attribute.quantity,
      });
      return acc;
    }, {});
  };

  const handleSelectAttribute = (attributeName, value) => {
    // Find the attribute to get its quantity
    const attribute = product.attributes.find(
      (attr) => attr.name === attributeName && attr.value === value
    );

    // If attribute is out of stock, don't allow selection
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

  // Combine the base image and more images
  const imageArray = product.moreImageURL
    ? [product.imageURL, ...product.moreImageURL]
    : [product.imageURL];

  // Check if entire product is out of stock (all attributes have 0 quantity)
  const isEntireProductOutOfStock = () => {
    if (!product.attributes || product.attributes.length === 0) {
      return product.stockQuantity <= 0;
    }
    return product.attributes.every((attr) => attr.quantity <= 0);
  };

  const currentSelectionAvailable = isCurrentSelectionAvailable();
  const entireProductOutOfStock = isEntireProductOutOfStock();

  console.log(product);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="max-w-screen-2xl mx-auto px-4 flex flex-col justify-start items-center ">
      {/* Fixed bottom panel for mobile devices */}
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
              ? "Loading"
              : entireProductOutOfStock
              ? "Notify Me"
              : !currentSelectionAvailable
              ? "Out of Stock"
              : "Buy Now"}
          </button>
          <button
            className="wishlist-btn"
            onClick={addToCart}
            disabled={
              isProductInWishlist ||
              (!entireProductOutOfStock && !currentSelectionAvailable)
            }
          >
            {isProductInWishlist
              ? "Added to Cart"
              : !currentSelectionAvailable
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>
      )}

      <div className="container w-full flex my-6 px-4">
        <h1 className="flex justify-center items-center font-Inter px-5 pl-2 sm:pl-12 md:pl-0 lg:pr-32">
          <span className="text-[10px] sm:text-sm">
            <HomeIcon
              color="#2C2C2C"
              onClick={onHomeClick}
              size={14}
              className="text-xs sm:text-sm"
            />
          </span>

          {product.category && (
            <>
              <span
                className="hover:text-[#CC4254] ml-2 text-[10px] font-semibold sm:text-sm"
                onClick={onCategoryClick}
              >
                {product.category.name}
              </span>
              <BsSlash className=" text-3xl" />
            </>
          )}

          <span className="hover:text-[#CC4254]  text-[10px] font-semibold sm:text-sm">
            {product.name}
          </span>
        </h1>
      </div>

      <div className="w-full lg:px-20 justify-center">
        <div className="w-full my-2 flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2  lg:h-[750px] h-[700px] flex flex-col">
            <ProductSlider
              images={imageArray}
              selectedImageIndex={selectedImageIndex}
              imgUrl={`${URL}/img/${selectedImageIndex}`}
            />
            <br />

            <div className="lg:w-1/2 bg-white p-5 rounded flex flex-col   h-fit">
              <div className="flex justify-center w-full">
                <div className="flex justify-center items-center">
                  <div className="flex gap-1 lg:gap-5 mt-5 justify-center items-center mx-auto">
                    {product.moreImageURL &&
                      product.moreImageURL.map((image, i) => (
                        <div
                          key={i}
                          className={`flex justify-center items-center w-12 h-12 lg:w-20 lg:h-20 overflow-clip border p ${
                            currentImage === image
                              ? "border-gray-500"
                              : "border-gray-300"
                          } hover:border-gray-500 cursor-pointer`}
                          onClick={() => setSelectedImageIndex(i + 1)}
                        >
                          <img
                            className="w-full h-full object-contain"
                            src={`${URL}/img/${image}`}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-4 lg:mt-0 lg:w-1/2 px-8">
            <h1 className="text-[20px] font-semibold lg:text-[20px] xl:text-[30px]  font-sans">
              {product.name}
            </h1>
            <div>
              <ProductDetailsStarAndRating rating={product.rating || 4} />
            </div>
            <div className="flex w-full mt-1  lg:mt-6 pt-3 border-b pb-6 ">
              <h1 className="text-[16px] lg:text-[20px] text-red-500 xl:text-[25px] font-semibold font-Inter">
                ₹
                {(
                  product.price -
                  product.price * (product.offer / 100)
                ).toFixed(2)}
              </h1>

              {product.offer && (
                <div className="flex justify-center ">
                  <h1 className="text-[16px] lg:text-[18px] xl:text-[20px]font-light font-Inter text-[#949494] ml-3 line-through">
                    ₹{product.price}
                  </h1>
                  <div className="ml-3 px-2 w-auto h-auto md:ml-4 bg-black rounded-[2px] text-white text-[12px] lg:text-[13px] flex justify-center items-center">
                    {parseInt(product.offer)} % Off
                  </div>
                </div>
              )}
            </div>

            <p className="text-[14px] border-b lg:text-[16px] py-4 pr-2">
              {product.description}
            </p>

            <div className="w-full max-w-4xl mx-auto ">
              <div className="flex  md:flex-row gap-4 items-center  mt-5 ">
                {/* Quantity Selector */}
                <Quantity
                  count={count}
                  setCount={setCount}
                  className="p-12"
                  maxQuantity={getSelectedAttributeQuantity()}
                />

                {/* Action Buttons */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  {/* Buy Now Button (Desktop) */}
                  {!entireProductOutOfStock && (
                    <Button
                      onClick={buyNow}
                      variant="destructive"
                      size="lg"
                      disabled={!currentSelectionAvailable || cartLoading}
                      className="w-full sm:w-auto hidden md:flex items-center gap-2"
                    >
                      <Zap size={18} />
                      {!currentSelectionAvailable ? "Out of Stock" : "Buy Now"}
                    </Button>
                  )}

                  {/* Add to Cart Button */}
                  {!entireProductOutOfStock && (
                    <Button
                      onClick={addToCart}
                      variant="default"
                      size="lg"
                      disabled={!currentSelectionAvailable || cartLoading}
                      className="w-full sm:w-auto hidden md:flex  items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      {!currentSelectionAvailable
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </Button>
                  )}

                  {/* Notify Me Button */}
                  {entireProductOutOfStock && (
                    <Button
                      onClick={() => notifyManager(product._id)}
                      variant="secondary"
                      size="lg"
                      disabled={cartLoading}
                      className="w-full sm:w-auto flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white"
                    >
                      <Bell size={18} />
                      {cartLoading ? "Processing..." : "Notify Me"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Attributes Selection */}
            <div className="w-full">
              <div className="w-full pt-3 font-Inter">
                {product.attributes &&
                  Object.entries(groupAttributes(product.attributes)).map(
                    ([name, values], index) => (
                      <div key={index} className="mt-4">
                        <p className="font-semibold text-gray-500 text-sm mb-1">
                          {name.toUpperCase()}
                        </p>

                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                          {values.map(
                            ({ value, imageIndex, quantity }, valueIndex) => (
                              <button
                                key={valueIndex}
                                className={`flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-300
                    ${
                      selectedAttributes[name] === value
                        ? "bg-black text-white border border-black"
                        : "bg-white text-black border border-gray-300 hover:bg-blue-100"
                    }
                    ${
                      quantity <= 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300 opacity-50"
                        : "cursor-pointer"
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
                                {quantity <= 0 && (
                                  <span className="mx-auto text-xs w-full"></span>
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Stock Status Display */}
            {!entireProductOutOfStock && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      currentSelectionAvailable ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {currentSelectionAvailable
                      ? `${getSelectedAttributeQuantity()} items available`
                      : "Selected combination is out of stock"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div></div>
      </div>

      <DescReview product={product} id={product._id} />

      {/* Recommended Products */}
      <div className="w-full px-4 lg:px-20 mt-8 mb-8">
        <h2 className="text-xl lg:text-2xl text-center mb-4">
          You may also like
        </h2>
        {loadingproducts ? (
          <div className="flex justify-center items-center h-96">
            <JustLoading size={10} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
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
              <div className="col-span-full text-center">Nothing to show</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;
