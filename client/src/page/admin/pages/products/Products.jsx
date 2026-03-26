import React, { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../../../redux/actions/admin/productActions";
import TableRow from "./TableRow";
import BreadCrumbs from "../../Components/BreadCrumbs";
import FilterArray from "../../Components/FilterArray";
import JustLoading from "../../../../components/JustLoading";
import Pagination from "../../../../components/Pagination";
import SearchBar from "../../../../components/SearchBar";
import RangeDatePicker from "../../../../components/RangeDatePicker";
import ClearFilterButton from "../../Components/ClearFilterButton";

const StatsCard = ({ label, value, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-black mt-2">{value}</p>
        </div>
        {Icon && <div className="text-gray-300 text-2xl">{<Icon size={28} />}</div>}
      </div>
    </div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, error, totalAvailableProducts } = useSelector(
    (state) => state.products
  );

  // Filteration
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (type, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      if (type === "page") {
        setPage(1);
      }
      params.delete(type);
    } else {
      if (type === "page" && value === 1) {
        params.delete(type);
        setPage(1);
      } else {
        params.set(type, value);
        if (type === "page") {
          setPage(value);
        }
      }
    }
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  };

  // Removing filters
  const removeFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    params.delete("page");
    params.delete("status");
    params.delete("startingDate");
    params.delete("endingDate");
    setSearch("");
    setStartingDate("");
    setEndingDate("");
    setSearchParams(params);
  };

  // Getting products details
  useEffect(() => {
    dispatch(getProducts(searchParams));
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams]);

  return (
    <>
      <div className="p-6 lg:p-8 w-full overflow-y-auto bg-gray-50 min-h-screen">
        {/* Search Bar at Top */}
        <div className="mb-6">
          <SearchBar
            handleClick={handleFilter}
            search={search}
            setSearch={setSearch}
          />
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Products</h1>
            <BreadCrumbs list={["Dashboard", "Product List"]} />
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
            onClick={() => navigate("add")}
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Stats Card */}
        <div className="mb-6">
          <StatsCard label="Total Products" value={totalAvailableProducts} icon={Filter} />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="w-full lg:w-auto">
              <FilterArray
                list={[
                  "all",
                  "draft",
                  "published",
                  "out of stock",
                  "low quantity",
                  "unpublished",
                ]}
                handleClick={handleFilter}
              />
            </div>
            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
              <RangeDatePicker
                handleFilter={handleFilter}
                startingDate={startingDate}
                setStartingDate={setStartingDate}
                endingDate={endingDate}
                setEndingDate={setEndingDate}
              />
              <ClearFilterButton handleClick={removeFilters} />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <JustLoading size={10} />
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">Added</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <TableRow
                        index={index}
                        length={products.length}
                        product={product}
                        key={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-100 py-5">
                <Pagination
                  handleClick={handleFilter}
                  page={page}
                  number={10}
                  totalNumber={totalAvailableProducts}
                />
              </div>
            </>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center">
              <p className="text-gray-500 text-center text-lg">
                {error ? error : "No products found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
