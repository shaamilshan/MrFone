import React, { useEffect } from "react";
import ProductCard2 from "../Cards/ProductCard2";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import JustLoading from "../JustLoading";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRightLong } from "react-icons/fa6";

const OurProducts = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProducts, loading } = useSelector((state) => state.userProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 800, 
      once: true,
    });

    dispatch(getUserProducts(""));
    
  }, [searchParams, dispatch]);

  return (
    <div
      className="container mx-auto px-4 py-8 my-10 sm:my-14"
      id="newArrival"
      data-aos="fade-up"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 block">
            Customer Favorites
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Popular Products
          </h1>
        </div>

        <button
          onClick={() => navigate(`/collections`)}
          className="group flex items-center gap-2 text-sm font-bold bg-white border border-gray-200 px-5 py-2.5 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300 w-fit"
        >
          Explore More
          <FaArrowRightLong className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-72 ">
          <JustLoading size={6} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {userProducts && userProducts.length > 0 ? (
            userProducts
              .slice(0, 4)
              .map((product, index) => (
                <ProductCard2
                  product={product}
                  key={index}
                />
              ))
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p>Nothing to show</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OurProducts;
