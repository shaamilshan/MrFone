import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard2 from "@/components/Cards/ProductCard2";
import { getWishlist } from "@/redux/actions/user/wishlistActions";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import JustLoading from "@/components/JustLoading";
import { config } from "@/Common/configurations";
import { URL } from "@/Common/api";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Collections = () => {
  const { userProducts, loading, totalAvailableProducts } = useSelector(
    (state) => state.userProducts
  );
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);
  
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [storageOpen, setStorageOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const categoryParam = searchParams.get("category");
    const sortParam = searchParams.get("sort");
    const pageParam = searchParams.get("page");

    setSelectedCategories(categoryParam ? categoryParam.split(",") : []);
    setSort(sortParam || "");
    setPage(parseInt(pageParam || 1));
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/categories`, config);
      setCategories(data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    dispatch(getWishlist());
    dispatch(getUserProducts(searchParams));
  }, [searchParams, dispatch]);

  const handleCategoryToggle = (categoryId) => {
    const params = new URLSearchParams(searchParams);
    let cats = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(cats);
    
    if (cats.length > 0) {
      params.set("category", cats.join(","));
    } else {
      params.delete("category");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    setSort(value);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setPage(newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalAvailableProducts / 12);

  const storageOptions = ["128GB", "256GB", "512GB", "1TB"];
  
  const colorOptions = [
    { name: "Silver", code: "#C0C0C0" },
    { name: "Space Black", code: "#2C2C2C" },
    { name: "Gold", code: "#FFD700" },
    { name: "Blue", code: "#4169E1" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-4">
          All Products
        </h1>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto">
          Designed for excellence. Explore the complete lineup of world-class technology
          crafted for performance and elegance.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-1">
            <FilterSection
              title="CATEGORY"
              isOpen={categoryOpen}
              onToggle={() => setCategoryOpen(!categoryOpen)}
            >
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategoryToggle(cat._id)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="STORAGE"
              isOpen={storageOpen}
              onToggle={() => setStorageOpen(!storageOpen)}
            >
              <div className="space-y-2">
                {storageOptions.map((storage) => (
                  <label
                    key={storage}
                    className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStorage.includes(storage)}
                      onChange={() => {
                        setSelectedStorage(prev =>
                          prev.includes(storage)
                            ? prev.filter(s => s !== storage)
                            : [...prev, storage]
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{storage}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="COLOR"
              isOpen={colorOpen}
              onToggle={() => setColorOpen(!colorOpen)}
            >
              <div className="space-y-3">
                {colorOptions.map((color) => (
                  <label
                    key={color.name}
                    className="flex items-center space-x-3 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.name)}
                      onChange={() => {
                        setSelectedColors(prev =>
                          prev.includes(color.name)
                            ? prev.filter(c => c !== color.name)
                            : [...prev, color.name]
                        );
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code }}
                      />
                      <span className="text-sm text-gray-700">{color.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="PRICE RANGE"
              isOpen={priceOpen}
              onToggle={() => setPriceOpen(!priceOpen)}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="₹0"
                    value={priceRange.min || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="₹4,999+"
                    value={priceRange.max || ""}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection
              title="AVAILABILITY"
              isOpen={availabilityOpen}
              onToggle={() => setAvailabilityOpen(!availabilityOpen)}
            >
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">Out of Stock</span>
                </label>
              </div>
            </FilterSection>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">{userProducts.length}</span> products
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black bg-white"
                >
                  <option value="">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-96">
                <JustLoading size={10} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userProducts && userProducts.length > 0 ? (
                    userProducts.map((product, index) => (
                      <motion.div
                        key={product._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard2 product={product} star />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full h-96 flex flex-col justify-center items-center">
                      <p className="text-lg text-gray-500">No products found</p>
                      <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-16">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        page === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      ←
                    </button>
                    
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (page <= 3) {
                        pageNum = idx + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = page - 2 + idx;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                            page === pageNum
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-2 text-gray-400">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="w-10 h-10 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        page === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 uppercase tracking-wide">
            Experience Perfection
          </p>
          <p className="text-center text-xs text-gray-400 mt-4">
            © 2024 Apple Reseller. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-xs font-semibold text-gray-900 tracking-wide">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collections;
