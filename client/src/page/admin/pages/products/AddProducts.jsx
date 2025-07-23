import React, { useEffect, useState } from "react";
import { AiOutlineSave, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import CustomFileInput from "../../Components/CustomFileInput";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../../../redux/actions/admin/productActions";
import CustomSingleFileInput from "../../Components/CustomSingleFileInput";
import ConfirmModal from "../../../../components/ConfirmModal";
import BreadCrumbs from "../../Components/BreadCrumbs";
import toast from "react-hot-toast";
import { getCategories } from "../../../../redux/actions/admin/categoriesAction";

const AddProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get categories and user from Redux store
  const { categories, loading, error } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.auth || state.user); // Adjust based on your auth state structure

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // State variables
  const [statusList] = useState([
    "Draft",
    "Published", 
    "Unpublished",
    "Out of Stock",
    "Low Quantity",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stockQuantity: "",
    category: "",
    price: "",
    markup: "",
    offer: "",
    status: "Published",
  });

  const [imageURL, setImageURL] = useState("");
  const [moreImageURL, setMoreImageURL] = useState([]);
  const [attributes, setAttributes] = useState([]);

  // Attribute form state
  const [attributeForm, setAttributeForm] = useState({
    name: "",
    value: "",
    imageIndex: "1",
    quantity: "",
    highlight: false,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle single image upload
  const handleSingleImageInput = (img) => {
    setImageURL(img);
  };

  // Handle multiple image upload
  const handleMultipleImageInput = (files) => {
    setMoreImageURL(files || []);
  };

  // Handle attribute form changes
  const handleAttributeChange = (field, value) => {
    setAttributeForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add attribute
  const handleAddAttribute = (e) => {
    e.preventDefault();
    
    if (attributeForm.name.trim() === "" || attributeForm.value.trim() === "") {
      toast.error("Attribute name and value are required");
      return;
    }

    const newAttribute = {
      name: attributeForm.name,
      value: attributeForm.value,
      quantity: attributeForm.quantity || "0",
      isHighlight: attributeForm.highlight,
      imageIndex: attributeForm.imageIndex,
    };

    setAttributes(prev => [...prev, newAttribute]);
    
    // Reset form but keep name and imageIndex for convenience
    setAttributeForm(prev => ({
      ...prev,
      value: "",
      quantity: "",
      highlight: false,
    }));
  };

  // Remove attribute
  const handleRemoveAttribute = (index) => {
    setAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // Validation function
  const validateForm = () => {
    const { name, price, category, stockQuantity, offer } = formData;

    if (!name || !name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error("Price should be greater than 0");
      return false;
    }

    if (!category || category === "") {
      toast.error("Please select a category");
      return false;
    }

    if (offer && (parseFloat(offer) < 0 || parseFloat(offer) > 100)) {
      toast.error("Offer percentage must be between 0 and 100");
      return false;
    }

    if (!user?._id) {
      toast.error("User authentication required. Please login again.");
      return false;
    }

    if (!imageURL) {
      toast.error("Please upload a product thumbnail image");
      return false;
    }

    // Validate that imageURL is either a File or a valid URL
    if (typeof imageURL === 'string' && !imageURL.startsWith('http')) {
      toast.error("Invalid main image. Please upload again.");
      return false;
    }

    // Validate additional images if present
    if (moreImageURL && moreImageURL.length > 0) {
      const invalidFiles = Array.from(moreImageURL).filter(file => 
        !(file instanceof File) && !(file instanceof Blob) && 
        (typeof file === 'string' && !file.startsWith('http'))
      );
      
      if (invalidFiles.length > 0) {
        toast.error("Some additional images are invalid. Please re-upload them.");
        return false;
      }
    }

    return true;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    try {
      const productFormData = new FormData();
      
      // Add basic product data
      productFormData.append("name", formData.name.trim());
      productFormData.append("description", formData.description.trim());
      productFormData.append("stockQuantity", formData.stockQuantity || "100");
      productFormData.append("price", parseFloat(formData.price).toString());
      productFormData.append("markup", parseFloat(formData.markup || "0").toString());
      productFormData.append("category", formData.category);
      productFormData.append("offer", parseFloat(formData.offer || "0").toString());
      productFormData.append("status", formData.status.toLowerCase());
      productFormData.append("managerId", user._id);
      
      // Add attributes
      productFormData.append("attributes", JSON.stringify(attributes));
      
      // Add main image - check if it's a File object or URL
      if (imageURL) {
        if (typeof imageURL === 'string') {
          // If it's already a URL string
          productFormData.append("imageURL", imageURL);
        } else {
          // If it's a File object
          productFormData.append("imageURL", imageURL);
        }
      }
      
      // Add additional images - only if they are File objects
      if (moreImageURL && moreImageURL.length > 0) {
        // Filter out any non-File objects and add only valid files
        const validFiles = Array.from(moreImageURL).filter(file => 
          file instanceof File || file instanceof Blob
        );
        
        if (validFiles.length > 0) {
          validFiles.forEach((file, index) => {
            productFormData.append(`moreImageURL`, file);
          });
        }
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of productFormData.entries()) {
        console.log(key, value);
      }

      dispatch(createProduct(productFormData));
      toast.success("Product created successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Confirm Save?"
          negativeAction={toggleConfirm}
          positiveAction={handleSave}
        />
      )}

      {/* Main Content */}
      <div className="p-5 w-full overflow-y-scroll text-sm">
        {/* Top Bar */}
        <div className="flex justify-between items-center font-semibold">
          <div>
            <h1 className="font-bold text-2xl">Add Products</h1>
            <BreadCrumbs list={["Dashboard", "Products List", "Add Products"]} />
          </div>
          <div className="flex gap-3">
            <button
              className="admin-button-fl bg-gray-200 text-blue-700"
              onClick={() => navigate(-1)}
            >
              <AiOutlineClose />
              Cancel
            </button>
            <button
              className="admin-button-fl bg-blue-700 text-white"
              onClick={toggleConfirm}
            >
              <AiOutlineSave />
              Save
            </button>
          </div>
        </div>

        {/* Product Section */}
        <div className="lg:flex">
          {/* Left Column - Product Information */}
          <div className="lg:w-4/6 lg:mr-5">
            {/* Product Info & Thumbnail */}
            <div className="admin-div lg:flex gap-5">
              <div className="lg:w-1/3 mb-3 lg:mb-0">
                <h1 className="font-bold mb-3">Product Thumbnail</h1>
                <CustomSingleFileInput onChange={handleSingleImageInput} />
              </div>
              <div className="lg:w-2/3">
                <h1 className="font-bold">Product Information</h1>
                <p className="admin-label">Title *</p>
                <input
                  type="text"
                  placeholder="Type product name here"
                  className="admin-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <p className="admin-label">Description</p>
                <textarea
                  name="description"
                  id="description"
                  className="admin-input h-36"
                  placeholder="Type product description here..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
                <p className="admin-label">Quantity</p>
                <input
                  type="number"
                  placeholder="Type product quantity here"
                  className="admin-input"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                  min="0"
                />
              </div>
            </div>

            {/* Additional Images */}
            <div className="admin-div">
              <h1 className="font-bold">Product Images</h1>
              <p className="admin-label my-2">Drop Here</p>
              <CustomFileInput onChange={handleMultipleImageInput} />
            </div>

            {/* Attributes */}
            <div className="admin-div">
              <h1 className="font-bold mb-2">Product Attributes</h1>
              <form
                className="flex flex-col lg:flex-row items-center gap-3"
                onSubmit={handleAddAttribute}
              >
                <input
                  type="text"
                  className="admin-input-no-m w-full"
                  placeholder="Name"
                  value={attributeForm.name}
                  onChange={(e) => handleAttributeChange("name", e.target.value)}
                />
                <input
                  type="text"
                  className="admin-input-no-m w-full"
                  placeholder="Value"
                  value={attributeForm.value}
                  onChange={(e) => handleAttributeChange("value", e.target.value)}
                />
                <input
                  type="text"
                  className="admin-input-no-m w-full"
                  placeholder="Image Index"
                  value={attributeForm.imageIndex}
                  onChange={(e) => handleAttributeChange("imageIndex", e.target.value)}
                />
                <input
                  type="number"
                  className="admin-input-no-m w-full"
                  placeholder="Quantity"
                  value={attributeForm.quantity}
                  onChange={(e) => handleAttributeChange("quantity", e.target.value)}
                  min="0"
                />
                <div className="admin-input-no-m w-full lg:w-auto shrink-0">
                  <input
                    type="checkbox"
                    checked={attributeForm.highlight}
                    onChange={(e) => handleAttributeChange("highlight", e.target.checked)}
                  />
                  {" "}Highlight
                </div>
                <input
                  type="submit"
                  className="admin-button-fl w-full lg:w-auto bg-blue-700 text-white cursor-pointer"
                  value="Add"
                />
              </form>

              {/* Attributes List */}
              {attributes.length > 0 && (
                <div className="border mt-5 rounded-lg">
                  <div className="flex px-2 py-2 bg-gray-100 font-semibold">
                    <p className="w-2/6">Name</p>
                    <p className="w-2/6">Value</p>
                    <p className="w-1/6">Index</p>
                    <p className="w-1/6">Qty</p>
                    <p className="w-1/6">Highlight</p>
                    <p className="w-1/6">Action</p>
                  </div>
                  {attributes.map((attr, index) => (
                    <div
                      key={index}
                      className={`flex px-2 py-2 items-center ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <p className="w-2/6">{attr.name}</p>
                      <p className="w-2/6">{attr.value}</p>
                      <p className="w-1/6">{attr.imageIndex}</p>
                      <p className="w-1/6">{attr.quantity}</p>
                      <p className="w-1/6">{attr.isHighlight ? "Yes" : "No"}</p>
                      <button
                        type="button"
                        className="w-1/6 text-red-600 hover:text-red-800"
                        onClick={() => handleRemoveAttribute(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Settings */}
          <div className="lg:w-2/6">
            {/* Pricing */}
            <div className="admin-div">
              <h1 className="font-bold">Product Pricing</h1>
              <p className="admin-label">Price *</p>
              <input
                type="number"
                placeholder="Type product price here"
                className="admin-input"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                min="0"
                step="0.01"
              />
              <p className="admin-label">Markup (%)</p>
              <input
                type="number"
                placeholder="Type product markup here"
                className="admin-input"
                value={formData.markup}
                onChange={(e) => handleInputChange("markup", e.target.value)}
                min="0"
                max="1000"
              />
              <p className="admin-label">Offer (%)</p>
              <input
                type="number"
                placeholder="Type offer percentage here"
                className="admin-input"
                value={formData.offer}
                min="0"
                max="100"
                onChange={(e) => handleInputChange("offer", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="admin-div">
              <h1 className="font-bold">Category</h1>
              <p className="admin-label">Product Category *</p>
              <select
                name="categories"
                id="categories"
                className="admin-input"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              >
                <option value="">Choose a category</option>
                {categories?.map((cat, index) => (
                  <option key={index} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="admin-div">
              <h1 className="font-bold">Product Status</h1>
              <p className="admin-label">Status</p>
              <select
                name="status"
                id="status"
                className="admin-input"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                {statusList.map((st, index) => (
                  <option key={index} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProducts;