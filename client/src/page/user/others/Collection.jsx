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
import { ChevronDown, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [sort, setSort] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [storageOpen, setStorageOpen] = useState(false);

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

  // Dynamically extract storage options from product attributes
  const storageOptions = React.useMemo(() => {
    const storageSet = new Set();

    if (userProducts && userProducts.length > 0) {
      userProducts.forEach(product => {
        if (product.attributes && product.attributes.length > 0) {
          product.attributes.forEach(attr => {
            if (attr.combination) {
              attr.combination.split(",").forEach(part => {
                const [type, value] = part.split(":");
                if (!type || !value) return;
                const key = type.trim().toLowerCase();
                const val = value.trim();
                if (key === "storage") storageSet.add(val);
              });
            }
            if (attr.name) {
              const key = attr.name.trim().toLowerCase();
              const val = (attr.value || "").trim();
              if (val && key === "storage") storageSet.add(val);
            }
          });
        }
      });
    }

    return Array.from(storageSet).sort();
  }, [userProducts]);

  const activeFilterCount = selectedCategories.length + selectedStorage.length;

  const filtersContent = (
    <>
      <FilterSection
        title="Category"
        isOpen={categoryOpen}
        onToggle={() => setCategoryOpen(!categoryOpen)}
      >
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat._id}
              className="group flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat._id)}
                onChange={() => handleCategoryToggle(cat._id)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
              />
              <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Storage"
        isOpen={storageOpen}
        onToggle={() => setStorageOpen(!storageOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((storage) => (
            <button
              key={storage}
              onClick={() => {
                setSelectedStorage(prev =>
                  prev.includes(storage)
                    ? prev.filter(s => s !== storage)
                    : [...prev, storage]
                );
              }}
              className={`px-3.5 py-1.5 text-[12px] font-bold rounded-full border transition-all duration-200 ${
                selectedStorage.includes(storage)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
              }`}
            >
              {storage}
            </button>
          ))}
        </div>
      </FilterSection>



      <FilterSection
        title="Price Range"
        isOpen={priceOpen}
        onToggle={() => setPriceOpen(!priceOpen)}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="₹ Min"
            value={priceRange.min || ""}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all"
          />
          <span className="text-gray-300 font-light text-lg">–</span>
          <input
            type="number"
            placeholder="₹ Max"
            value={priceRange.max || ""}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/10 focus:border-black outline-none transition-all"
          />
        </div>
      </FilterSection>

      <FilterSection
        title="Availability"
        isOpen={availabilityOpen}
        onToggle={() => setAvailabilityOpen(!availabilityOpen)}
      >
        <div className="space-y-2.5">
          <label className="group flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
            />
            <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">In Stock</span>
          </label>
          <label className="group flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
            />
            <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">Out of Stock</span>
          </label>
        </div>
      </FilterSection>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:border-black transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-sm text-gray-400">
              <span className="font-bold text-gray-900">{totalAvailableProducts || userProducts.length}</span> products
            </span>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-black/10 focus:border-black outline-none cursor-pointer hover:border-gray-400 transition-colors"
            >
              <option value="">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
              <option value="newest">Newest First</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedStorage([]);
                      setSelectedColors([]);
                      const params = new URLSearchParams(searchParams);
                      params.delete("category");
                      params.delete("page");
                      setSearchParams(params);
                    }}
                    className="text-[11px] font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filtersContent}
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[90] lg:hidden shadow-2xl overflow-y-auto"
                >
                  <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="text-sm font-black uppercase tracking-[0.15em]">Filters</h3>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-5">
                    {filtersContent}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <JustLoading size={10} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {userProducts && userProducts.length > 0 ? (
                    userProducts.map((product, index) => (
                      <motion.div
                        key={product._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.4 }}
                      >
                        <ProductCard2 product={product} star />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full h-96 flex flex-col justify-center items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <SlidersHorizontal size={28} className="text-gray-300" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">No products found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-16">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        page === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-black hover:text-white bg-white border border-gray-200"
                      }`}
                    >
                      <ChevronLeft size={18} />
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
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                            page === pageNum
                              ? "bg-black text-white shadow-md"
                              : "bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="px-1 text-gray-300">•••</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="w-10 h-10 rounded-xl text-sm font-bold bg-white text-gray-600 border border-gray-200 hover:border-black hover:text-black transition-all duration-200"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        page === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-black hover:text-white bg-white border border-gray-200"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-100 py-5">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-[13px] font-bold text-gray-900">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 group-hover:text-black transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
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
