import React, { useEffect, useState } from "react";
import { Plus, Edit2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "../../../../redux/actions/admin/categoriesAction";
import date from "date-and-time";
import BreadCrumbs from "../../Components/BreadCrumbs";
import JustLoading from "../../../../components/JustLoading";
import StatusComponent from "../../../../components/StatusComponent";
import FilterArray from "../../Components/FilterArray";
import SearchBar from "../../../../components/SearchBar";
import { URL } from "@common/api";
import Pagination from "../../../../components/Pagination";

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

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories, loading, error, totalAvailableCategories } = useSelector(
    (state) => state.categories
  );

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

  useEffect(() => {
    dispatch(getCategories(searchParams));
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams]);

  return (
    <>
      <div className="p-6 lg:p-8 w-full overflow-y-auto bg-gray-50 min-h-screen">
        {/* Search Bar */}
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
            <h1 className="text-4xl font-bold text-black mb-2">Categories</h1>
            <BreadCrumbs list={["Dashboard", "Category List"]} />
          </div>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
            onClick={() => navigate("create")}
          >
            <Plus size={18} />
            Create Category
          </button>
        </div>

        {/* Stats Card */}
        <div className="mb-6">
          <StatsCard label="Total Categories" value={totalAvailableCategories} />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
          <FilterArray
            list={["all", "active", "blocked"]}
            handleClick={handleFilter}
          />
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <JustLoading size={10} />
            </div>
          ) : categories && categories.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden flex justify-center items-center shrink-0 rounded-lg bg-gray-100">
                              {category.imgURL ? (
                                <img
                                  src={`${URL}/img/${category.imgURL}`}
                                  alt={category.name}
                                  className="object-contain w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-300"></div>
                              )}
                            </div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 line-clamp-1">
                          {category.description || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.createdAt
                            ? date.format(new Date(category.createdAt), "MMM DD YYYY")
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <StatusComponent
                            status={category.isActive ? "Active" : "Blocked"}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => navigate(`edit/${category._id}`)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit category"
                          >
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-100 py-5">
                <Pagination
                  handleClick={handleFilter}
                  page={page}
                  number={10}
                  totalNumber={totalAvailableCategories}
                />
              </div>
            </>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center">
              <p className="text-gray-500 text-center text-lg">
                {error ? error : "No categories found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
