import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import date from "date-and-time";
import { useNavigate } from "react-router-dom";
import StatusComponent from "../../../../components/StatusComponent";
import { URL } from "@common/api";
import axios from "axios";
import { config } from "@/Common/configurations";

const TableRow = ({ index, length, product }) => {
  const navigate = useNavigate();

  const handleDelete = async (productId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      try {
        const response = await axios.delete(`${URL}/admin/product/${productId}`, config);
        if (response.data.product) {
          alert("Product deleted successfully!");
          navigate("/admin/products");
        } else {
          alert("Failed to delete the product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0">
      {/* Product Name with Image */}
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden flex justify-center items-center shrink-0 rounded-lg bg-gray-100">
            {product.imageURL ? (
              <img
                src={`${URL}/img/${product.imageURL}`}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>
          <p className="line-clamp-1 font-medium text-gray-900 max-w-xs">{product.name}</p>
        </div>
      </td>

      {/* Description */}
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="line-clamp-1 w-16 truncate text-xs overflow-hidden" title={product.description}>{product.description}</div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {product?.category?.name || "—"}
      </td>

      {/* Quantity */}
      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
        {product.stockQuantity}
      </td>

      {/* Price */}
      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
        ₹{product.price}
      </td>

      {/* Status */}
      <td className="px-6 py-4 text-sm">
        <StatusComponent status={product.status} />
      </td>

      {/* Added Date */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {product.createdAt
          ? date.format(new Date(product.createdAt), "MMM DD YYYY")
          : "—"}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`edit/${product._id}`)}
            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit product"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TableRow;