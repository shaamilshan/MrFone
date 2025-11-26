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
  const { user } = useSelector((state) => state.auth || state.user);

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

  const [productType, setProductType] = useState("simple"); // "simple" or "variable"

  // Consolidated form data state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stockQuantity: "",
    price: "",
    markup: "",
    category: "",
    offer: "",
    status: "Published"
  });

  const [imageURL, setImageURL] = useState("");
  const [moreImageURL, setMoreImageURL] = useState([]);
  const [attributes, setAttributes] = useState([]);

  // Multi-attribute state
  const [attributeTypes, setAttributeTypes] = useState([]); // ["Color", "Storage"]
  const [attributeOptions, setAttributeOptions] = useState({}); // {Color: ["Red", "Blue"], Storage: ["128GB", "256GB"]}
  const [currentAttributeType, setCurrentAttributeType] = useState("");
  const [currentAttributeValue, setCurrentAttributeValue] = useState("");

  // Variant form state (for combinations)
  const [variantForm, setVariantForm] = useState({
    selectedAttributes: {}, // {Color: "Blue", Storage: "128GB"}
    price: "",
    quantity: "",
    markup: "",
    imageIndex: "1",
    highlight: false,
  });

  // Attribute form state
  const [attributeForm, setAttributeForm] = useState({
    name: "",
    value: "",
    imageIndex: "1",
    quantity: "",
    price: "",
    markup: "",
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

  // Handle variant form changes
  const handleVariantChange = (field, value) => {
    setVariantForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add attribute type (e.g., "Color", "Storage")
  const handleAddAttributeType = () => {
    if (!currentAttributeType.trim()) {
      toast.error("Please enter attribute type name");
      return;
    }
    
    if (attributeTypes.includes(currentAttributeType)) {
      toast.error("This attribute type already exists");
      return;
    }

    setAttributeTypes([...attributeTypes, currentAttributeType]);
    setAttributeOptions({...attributeOptions, [currentAttributeType]: []});
    setCurrentAttributeType("");
    toast.success(`Attribute type "${currentAttributeType}" added`);
  };

  // Add value to attribute type (e.g., "Red" to "Color")
  const handleAddAttributeValue = (typeName) => {
    if (!currentAttributeValue.trim()) {
      toast.error("Please enter attribute value");
      return;
    }

    const existingValues = attributeOptions[typeName] || [];
    if (existingValues.includes(currentAttributeValue)) {
      toast.error("This value already exists");
      return;
    }

    setAttributeOptions({
      ...attributeOptions,
      [typeName]: [...existingValues, currentAttributeValue]
    });
    setCurrentAttributeValue("");
  };

  // Remove attribute type
  const handleRemoveAttributeType = (typeName) => {
    setAttributeTypes(attributeTypes.filter(t => t !== typeName));
    const newOptions = {...attributeOptions};
    delete newOptions[typeName];
    setAttributeOptions(newOptions);
    
    // Clear from variant form if selected
    const newSelectedAttributes = {...variantForm.selectedAttributes};
    delete newSelectedAttributes[typeName];
    setVariantForm({...variantForm, selectedAttributes: newSelectedAttributes});
  };

  // Remove attribute value
  const handleRemoveAttributeValue = (typeName, value) => {
    setAttributeOptions({
      ...attributeOptions,
      [typeName]: attributeOptions[typeName].filter(v => v !== value)
    });
  };

  // Handle single image upload
  const handleSingleImageInput = (img) => {
    setImageURL(img);
  };

  // Handle multiple image upload
  const handleMultipleImageInput = (files) => {
    setMoreImageURL(files || []);
  };

  // Add variant with combination
  const handleAddVariant = (e) => {
    e.preventDefault();
    
    // Validate all attribute types are selected
    if (attributeTypes.length === 0) {
      toast.error("Please add at least one attribute type first");
      return;
    }

    const missingAttributes = attributeTypes.filter(
      type => !variantForm.selectedAttributes[type]
    );
    
    if (missingAttributes.length > 0) {
      toast.error(`Please select values for: ${missingAttributes.join(", ")}`);
      return;
    }

    if (!variantForm.price || parseFloat(variantForm.price) <= 0) {
      toast.error("Variant price is required and must be greater than 0");
      return;
    }

    if (!variantForm.quantity || parseInt(variantForm.quantity) < 0) {
      toast.error("Variant quantity is required and cannot be negative");
      return;
    }

    // Create combination string and display name
    const combinationParts = attributeTypes.map(type => 
      `${type}:${variantForm.selectedAttributes[type]}`
    );
    const combination = combinationParts.join(",");
    const displayName = attributeTypes.map(type => variantForm.selectedAttributes[type]).join(" + ");

    // Check if combination already exists
    if (attributes.some(attr => attr.combination === combination)) {
      toast.error("This variant combination already exists");
      return;
    }

    const variant = {
      name: attributeTypes[0], // Primary attribute type
      value: displayName,
      combination: combination,
      selectedAttributes: {...variantForm.selectedAttributes},
      quantity: parseInt(variantForm.quantity),
      price: parseFloat(variantForm.price),
      markup: parseFloat(variantForm.markup || "0"),
      imageIndex: variantForm.imageIndex,
      isHighlight: variantForm.highlight,
    };

    setAttributes([...attributes, variant]);
    
    // Reset form
    setVariantForm({
      selectedAttributes: {},
      price: "",
      quantity: "",
      markup: "",
      imageIndex: "1",
      highlight: false,
    });

    toast.success("Variant added successfully");
  };

  // Remove attribute
  const handleRemoveAttribute = (index) => {
    setAttributes(prev => prev.filter((_, i) => i !== index));
  };

  // Validation function
  const validateForm = () => {
    if (!formData.name || !formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.category || formData.category === "") {
      toast.error("Please select a category");
      return false;
    }

    // Validation for simple products
    if (productType === "simple") {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Price should be greater than 0");
        return false;
      }
      if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
        toast.error("Stock quantity is required and cannot be negative");
        return false;
      }
    }

    // Validation for variable products
    if (productType === "variable") {
      if (attributes.length === 0) {
        toast.error("Please add at least one product variant with price and stock quantity");
        return false;
      }
    }

    if (formData.offer && (parseFloat(formData.offer) < 0 || parseFloat(formData.offer) > 100)) {
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
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const productFormData = new FormData();
      
      let totalStock;
      let basePrice;
      let baseMarkup;
      
      if (productType === "simple") {
        // Simple product: use direct values
        totalStock = parseInt(formData.stockQuantity || "0");
        basePrice = parseFloat(formData.price || "0");
        baseMarkup = parseFloat(formData.markup || "0");
      } else {
        // Variable product: calculate from variants
        totalStock = attributes.reduce((sum, attr) => sum + parseInt(attr.quantity || 0), 0);
        basePrice = attributes.length > 0 
          ? Math.min(...attributes.map(attr => parseFloat(attr.price || 0)))
          : 0;
        baseMarkup = 0;
      }
      
      // Add basic product data
      productFormData.append("name", formData.name.trim());
      productFormData.append("description", formData.description.trim());
      productFormData.append("stockQuantity", totalStock.toString());
      productFormData.append("price", basePrice.toString());
      productFormData.append("markup", baseMarkup.toString());
      productFormData.append("category", formData.category);
      productFormData.append("offer", parseFloat(formData.offer || "0").toString());
      productFormData.append("status", formData.status.toLowerCase());
      productFormData.append("managerId", user._id);
      
      // Add attributes (only for variable products)
      if (productType === "variable") {
        productFormData.append("attributes", JSON.stringify(attributes));
      } else {
        productFormData.append("attributes", JSON.stringify([]));
      }
      
      // Add main image
      if (imageURL) {
        productFormData.append("imageURL", imageURL);
      }
      
      // Add additional images
      if (moreImageURL && moreImageURL.length > 0) {
        const validFiles = Array.from(moreImageURL).filter(file => 
          file instanceof File || file instanceof Blob
        );
        
        if (validFiles.length > 0) {
          validFiles.forEach((file) => {
            productFormData.append(`moreImageURL`, file);
          });
        }
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let [key, value] of productFormData.entries()) {
        console.log(key, value);
      }

      const result = await dispatch(createProduct(productFormData));
      
      if (result.type === "products/createProduct/fulfilled") {
        toast.success("Product created successfully!");
        navigate(-1);
      } else if (result.type === "products/createProduct/rejected") {
        toast.error(result.payload || "Failed to create product");
        console.error("Product creation failed:", result);
      }
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
            {/* Product Type Selection */}
            <div className="admin-div">
              <h1 className="font-bold mb-3">Product Type</h1>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    value="simple"
                    checked={productType === "simple"}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Simple Product</span>
                  <span className="text-xs text-gray-500">(Single price & stock)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="productType"
                    value="variable"
                    checked={productType === "variable"}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium">Variable Product</span>
                  <span className="text-xs text-gray-500">(Multiple variants with different prices)</span>
                </label>
              </div>
            </div>

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
                
                {/* Show quantity and price for simple products */}
                {productType === "simple" && (
                  <>
                    <p className="admin-label">Stock Quantity *</p>
                    <input
                      type="number"
                      placeholder="Type product quantity here"
                      className="admin-input"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                      min="0"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div className="admin-div">
              <h1 className="font-bold">Product Images</h1>
              <p className="admin-label my-2">Drop Here</p>
              <CustomFileInput onChange={handleMultipleImageInput} />
            </div>

            {/* Variants/Attributes - Only for Variable Products */}
            {productType === "variable" && (
              <div className="admin-div">
                <h1 className="font-bold mb-2">Product Variants Configuration</h1>
                <p className="text-xs text-gray-600 mb-4">Step 1: Define attribute types (e.g., Color, Storage, Size) and their possible values.</p>
                
                {/* Step 1: Add Attribute Types */}
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <h2 className="font-semibold mb-2">Add Attribute Types</h2>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="admin-input-no-m flex-1"
                      placeholder="Attribute Type (e.g., Color, Storage, Size)"
                      value={currentAttributeType}
                      onChange={(e) => setCurrentAttributeType(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttributeType())}
                    />
                    <button
                      type="button"
                      className="admin-button-fl bg-green-600 text-white"
                      onClick={handleAddAttributeType}
                    >
                      Add Type
                    </button>
                  </div>

                  {/* Display Added Attribute Types */}
                  {attributeTypes.length > 0 && (
                    <div className="space-y-3">
                      {attributeTypes.map((typeName, index) => (
                        <div key={index} className="border rounded p-3 bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-blue-600">{typeName}</h3>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800 text-sm"
                              onClick={() => handleRemoveAttributeType(typeName)}
                            >
                              Remove Type
                            </button>
                          </div>
                          
                          {/* Add values to this type */}
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              className="admin-input-no-m flex-1 text-sm"
                              placeholder={`Add value for ${typeName} (e.g., Red, Blue)`}
                              value={currentAttributeValue}
                              onChange={(e) => setCurrentAttributeValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttributeValue(typeName))}
                            />
                            <button
                              type="button"
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              onClick={() => handleAddAttributeValue(typeName)}
                            >
                              Add Value
                            </button>
                          </div>

                          {/* Display values */}
                          {attributeOptions[typeName] && attributeOptions[typeName].length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {attributeOptions[typeName].map((value, vIndex) => (
                                <span
                                  key={vIndex}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                                >
                                  {value}
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 ml-1"
                                    onClick={() => handleRemoveAttributeValue(typeName, value)}
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Step 2: Create Variant Combinations */}
                {attributeTypes.length > 0 && (
                  <>
                    <p className="text-xs text-gray-600 mb-3">Step 2: Create variant combinations with price and stock for each.</p>
                    <form
                      className="border rounded-lg p-4 bg-gray-50"
                      onSubmit={handleAddVariant}
                    >
                      <h2 className="font-semibold mb-3">Add Variant Combination</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        {/* Attribute selectors */}
                        {attributeTypes.map((typeName) => (
                          <div key={typeName}>
                            <label className="block text-sm font-medium mb-1">{typeName} *</label>
                            <select
                              className="admin-input-no-m"
                              value={variantForm.selectedAttributes[typeName] || ""}
                              onChange={(e) => setVariantForm({
                                ...variantForm,
                                selectedAttributes: {
                                  ...variantForm.selectedAttributes,
                                  [typeName]: e.target.value
                                }
                              })}
                            >
                              <option value="">Select {typeName}</option>
                              {(attributeOptions[typeName] || []).map((value, index) => (
                                <option key={index} value={value}>{value}</option>
                              ))}
                            </select>
                          </div>
                        ))}

                        <div>
                          <label className="block text-sm font-medium mb-1">Price *</label>
                          <input
                            type="number"
                            className="admin-input-no-m"
                            placeholder="Price"
                            value={variantForm.price}
                            onChange={(e) => handleVariantChange("price", e.target.value)}
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                          <input
                            type="number"
                            className="admin-input-no-m"
                            placeholder="Quantity"
                            value={variantForm.quantity}
                            onChange={(e) => handleVariantChange("quantity", e.target.value)}
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Markup (%) - Optional</label>
                          <input
                            type="number"
                            className="admin-input-no-m"
                            placeholder="Markup"
                            value={variantForm.markup}
                            onChange={(e) => handleVariantChange("markup", e.target.value)}
                            min="0"
                            max="1000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Image Index</label>
                          <input
                            type="text"
                            className="admin-input-no-m"
                            placeholder="1, 2, 3..."
                            value={variantForm.imageIndex}
                            onChange={(e) => handleVariantChange("imageIndex", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="variantHighlight"
                            checked={variantForm.highlight}
                            onChange={(e) => handleVariantChange("highlight", e.target.checked)}
                          />
                          <label htmlFor="variantHighlight" className="text-sm">Highlight this variant</label>
                        </div>
                        <button
                          type="submit"
                          className="admin-button-fl bg-blue-700 text-white"
                        >
                          Add Variant Combination
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* Variants List */}
              {attributes.length > 0 && (
                <div className="border mt-5 rounded-lg overflow-x-auto">
                  <div className="flex px-2 py-2 bg-gray-100 font-semibold min-w-max">
                    <p className="w-48">Variant Combination</p>
                    <p className="w-24">Price</p>
                    <p className="w-24">Quantity</p>
                    <p className="w-24">Markup (%)</p>
                    <p className="w-20">Image</p>
                    <p className="w-24">Highlight</p>
                    <p className="w-20">Action</p>
                  </div>
                  {attributes.map((attr, index) => (
                    <div
                      key={index}
                      className={`flex px-2 py-2 items-center min-w-max ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <p className="w-48 font-medium">{attr.value}</p>
                      <p className="w-24 font-semibold">${attr.price}</p>
                      <p className="w-24">{attr.quantity}</p>
                      <p className="w-24">{attr.markup || 0}%</p>
                      <p className="w-20">{attr.imageIndex}</p>
                      <p className="w-24">{attr.isHighlight ? "✓ Yes" : "No"}</p>
                      <button
                        type="button"
                        className="w-20 text-red-600 hover:text-red-800 font-medium"
                        onClick={() => handleRemoveAttribute(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="px-2 py-2 bg-blue-50 font-semibold">
                    <p>Total Stock: {attributes.reduce((sum, attr) => sum + parseInt(attr.quantity || 0), 0)} units</p>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
          {/* Right Column - Settings */}
          <div className="lg:w-2/6">
            {/* Pricing - Only for Simple Products */}
            {productType === "simple" && (
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
              </div>
            )}

            {/* Offer */}
            <div className="admin-div">
              <h1 className="font-bold">Product Offer</h1>
              <p className="admin-label">Offer Discount (%)</p>
              <input
                type="number"
                placeholder="Type offer percentage here"
                className="admin-input"
                value={formData.offer}
                min="0"
                max="100"
                onChange={(e) => handleInputChange("offer", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {productType === "simple" 
                  ? "This discount will apply to the product price" 
                  : "This discount will apply to all variants"}
              </p>
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