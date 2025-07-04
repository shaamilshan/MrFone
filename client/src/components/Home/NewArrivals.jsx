import React, { useEffect } from "react";
import ProductCard2 from "../Cards/ProductCard2";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import JustLoading from "../JustLoading";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaArrowRightLong } from "react-icons/fa6";

const NewArrivals = () => {
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
      className="container mx-auto px-4 py-8"
      id="newArrival"
      data-aos="fade-up"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl md:text-2xl font-semibold">Latest product</h1>

        <div
          onClick={() => navigate(`/collections`)}
          className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          View all products
          <FaArrowRightLong className="h-5 w-5 ml-1 text-red-700" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-72 ">
          <JustLoading size={6} />
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {userProducts && userProducts.length > 0 ? (
            userProducts
              .slice(0, 5)
              .map((product, index) => (
                <ProductCard2
                  product={product}
                  key={index}
                  className="p-1 shadow-sm hover:shadow-md transition w-28 h-36"
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

export default NewArrivals;
