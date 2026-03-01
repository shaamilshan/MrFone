import React, { useEffect, useState } from "react";
import { AiOutlineSave, AiOutlineClose, AiOutlineDelete, AiOutlineAppstoreAdd } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import CustomFileInput from "../../Components/CustomFileInput";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../../../../redux/actions/admin/productActions";
import CustomSingleFileInput from "../../Components/CustomSingleFileInput";
import ConfirmModal from "../../../../components/ConfirmModal";
import axios from "axios";
import BreadCrumbs from "../../Components/BreadCrumbs";
import { getCategories } from "../../../../redux/actions/admin/categoriesAction";
import { URL } from "@common/api";
import toast from "react-hot-toast";

const EditProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const [statusList, setStatusList] = useState([
    "draft",
    "published",
    "unpublished",
    "out of stock",
    "low quantity",
  ]);

  const [duplicateFetchData, setDuplicateFetchData] = useState({});
  const [productType, setProductType] = useState("simple"); // "simple" or "variable"
  const [fetchedData, setFetchedData] = useState({
    name: "",
    description: "",
    stockQuantity: 0,
    category: "",
    imageURL: "",
    status: "",
    attributes: [],
    price: "",
    markup: "",
    moreImageURL: [],
    offer: "",
  });

  // Multi-attribute state
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState({});
  const [currentAttributeType, setCurrentAttributeType] = useState("");
  const [currentAttributeValue, setCurrentAttributeValue] = useState("");

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    selectedAttributes: {},
    price: "",
    quantity: "",
    markup: "",
    imageIndex: "1",
    highlight: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFetchedData({
      ...fetchedData,
      [name]: value,
    });
  };

  const handleAttributeChange = (index, attributeName, value) => {
    setFetchedData((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes[index] = {
        ...updatedAttributes[index],
        [attributeName]: value,
      };
      return {
        ...prevData,
        attributes: updatedAttributes,
      };
    });
  };

  const handleDeleteAttribute = (index) => {
    setFetchedData((prevData) => {
      const updatedAttributes = [...prevData.attributes];
      updatedAttributes.splice(index, 1);
      return {
        ...prevData,
        attributes: updatedAttributes,
      };
    });
  };

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const { data } = await axios.get(`${URL}/admin/product/${id}`, {
          withCredentials: true,
        });

        setFetchedData({ ...data.product });
        setDuplicateFetchData({ ...data.product });
        
        // Detect product type based on attributes
        if (data.product.attributes && data.product.attributes.length > 0) {
          // Check if multi-attribute combinations exist
          const hasMultiAttributes = data.product.attributes.some(attr => attr.combination);
          setProductType(hasMultiAttributes ? "variable" : "simple");
          
          if (hasMultiAttributes) {
            // Extract attribute types and options from existing variants
            const types = new Set();
            const options = {};
            
            data.product.attributes.forEach(attr => {
              if (attr.combination) {
                const parts = attr.combination.split(',');
                parts.forEach(part => {
                  const [type, value] = part.split(':');
                  types.add(type);
                  if (!options[type]) {
                    options[type] = new Set();
                  }
                  options[type].add(value);
                });
              }
            });
            
            setAttributeTypes(Array.from(types));
            const optionsObj = {};
            for (const [key, valueSet] of Object.entries(options)) {
              optionsObj[key] = Array.from(valueSet);
            }
            setAttributeOptions(optionsObj);
          }
        } else {
          setProductType("simple");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProductDetails();
  }, []);

  const [newThumb, setNewThumb] = useState("");
  const handleSingleImageInput = (img) => {
    setNewThumb(img);
  };

  const [newMoreImage, setNewMoreImage] = useState([]);
  const handleMultipleImageInput = (files) => {
    setNewMoreImage(files);
  };

  const handleSave = async () => {
    const formData = new FormData();

    // Calculate totals for variable products
    if (productType === "variable" && fetchedData.attributes.length > 0) {
      const totalStock = fetchedData.attributes.reduce((sum, attr) => sum + parseInt(attr.quantity || 0), 0);
      const basePrice = Math.min(...fetchedData.attributes.map(attr => parseFloat(attr.price || 0)));
      
      fetchedData.stockQuantity = totalStock;
      fetchedData.price = basePrice;
    }

    // Always send attributes if they exist (important for variants)
    if (fetchedData.attributes && fetchedData.attributes.length > 0) {
      formData.append("attributes", JSON.stringify(fetchedData.attributes));
    }

    // Send other fields that have changed
    for (const key in fetchedData) {
      if (key === "attributes") continue; // Already handled above
      
      if (duplicateFetchData[key] !== fetchedData[key]) {
        if (key === "moreImageURL") {
          // Append existing images first
          fetchedData[key].forEach((item) => {
            formData.append("moreImageURL", item);
          });
        } else {
          formData.append(key, fetchedData[key]);
        }
      }
    }

    // Add new images to formData
    if (newMoreImage.length > 0) {
      for (const file of newMoreImage) {
        formData.append("moreImageURL", file); // Append new images
      }
    }

    if (newThumb) {
      formData.append("imageURL", newThumb);
    }

    try {
      const result = await dispatch(updateProduct({ id: id, formData: formData })).unwrap();
      toast.success("Product updated successfully!");
      navigate(-1);
    } catch (error) {
      toast.error(error || "Failed to update product");
      console.error("Update error:", error);
    }
  };

  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributeImageIndex, setAttributeImageIndex] = useState("");
  const [attributeQuantity, setAttributeQuantity] = useState("");
  const [attributeHighlight, setAttributeHighlight] = useState(false);
  const [attributePrice, setAttributePrice] = useState("");
  const [attributeMarkup, setAttributeMarkup] = useState("");

  // Multi-attribute handlers
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

  const handleRemoveAttributeType = (typeName) => {
    setAttributeTypes(attributeTypes.filter(t => t !== typeName));
    const newOptions = {...attributeOptions};
    delete newOptions[typeName];
    setAttributeOptions(newOptions);
    
    const newSelectedAttributes = {...variantForm.selectedAttributes};
    delete newSelectedAttributes[typeName];
    setVariantForm({...variantForm, selectedAttributes: newSelectedAttributes});
  };

  const handleRemoveAttributeValue = (typeName, value) => {
    setAttributeOptions({
      ...attributeOptions,
      [typeName]: attributeOptions[typeName].filter(v => v !== value)
    });
  };

  const handleVariantChange = (field, value) => {
    setVariantForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
    
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

    const combinationParts = attributeTypes.map(type => 
      `${type}:${variantForm.selectedAttributes[type]}`
    );
    const combination = combinationParts.join(",");
    const displayName = attributeTypes.map(type => variantForm.selectedAttributes[type]).join(" + ");

    if (fetchedData.attributes.some(attr => attr.combination === combination)) {
      toast.error("This variant combination already exists");
      return;
    }

    const variant = {
      name: attributeTypes[0],
      value: displayName,
      combination: combination,
      selectedAttributes: {...variantForm.selectedAttributes},
      quantity: parseInt(variantForm.quantity),
      price: parseFloat(variantForm.price),
      markup: parseFloat(variantForm.markup || "0"),
      imageIndex: variantForm.imageIndex,
      isHighlight: variantForm.highlight,
    };

    setFetchedData((prevData) => ({
      ...prevData,
      attributes: [...prevData.attributes, variant],
    }));
    
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

  // Handler for simple product attributes
  const handleAddAttribute = () => {
    if (!attributeName.trim() || !attributeValue.trim()) {
      toast.error("Attribute name and value are required");
      return;
    }

    const attribute = {
      name: attributeName,
      value: attributeValue,
    };

    setFetchedData((prevData) => ({
      ...prevData,
      attributes: [...prevData.attributes, attribute],
    }));

    setAttributeName("");
    setAttributeValue("");
    toast.success("Attribute added successfully");
  };

  const attributeHandler = (e) => {
    e.preventDefault();
    if (attributeName.trim() === "" || attributeValue.trim() === "") {
      return;
    }
    if (attributeQuantity.trim() == "" || attributeImageIndex.trim() == "") {
      setAttributeImageIndex("1");
      setAttributeQuantity("0");
    }
    const attribute = {
      name: attributeName,
      value: attributeValue,
      imageIndex: attributeImageIndex,
      quantity: attributeQuantity,
      isHighlight: attributeHighlight,
      price: attributePrice,
    };
    setFetchedData((prevData) => ({
      ...prevData,
      attributes: [...prevData.attributes, attribute],
    }));
    setAttributeHighlight(false);
    setAttributeName("");
    setAttributeValue("");
    setAttributeQuantity("");
    setAttributeImageIndex(""); // Reset the index
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const toggleConfirm = () => {
    // if (fetchedData.offer && fetchedData.offer < 1) {
    //   toast.error("Offer can't go below 1");
    //   return;
    // }
    // if (fetchedData.offer && fetchedData.offer > 100) {
    //   toast.error("Offer can't exceed 100");
    //   return;
    // }
    setShowConfirm(!showConfirm);
  };

  const deleteOneProductImage = (index) => {
    const updatedImages = [...fetchedData.moreImageURL];
    updatedImages.splice(index, 1);
    setFetchedData((prevData) => ({
      ...prevData,
      ["moreImageURL"]: updatedImages,
    }));
  };

  return (
    <>
      {/* Modal */}
      {showConfirm && (
        <ConfirmModal
          title="Confirm Save?"
          negativeAction={toggleConfirm}
          positiveAction={handleSave}
        />
      )}
      {/* Product edit page */}
      <div className="p-5 w-full overflow-y-scroll text-sm">
        {/* Top Bar */}
        <div className="flex justify-between items-center font-semibold">
          <div>
            <h1 className="font-bold text-2xl">Edit Products</h1>
            {/* Bread Crumbs */}
            <BreadCrumbs
              list={["Dashboard", "Category List", "Edit Products"]}
            />
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
              Update
            </button>
          </div>
        </div>
        {/* Product Section */}
        <div className="lg:flex ">
          {/* Product Information */}
          <div className="lg:w-4/6 lg:mr-5">
            <div className="admin-div lg:flex gap-5">
              <div className="lg:w-1/3 mb-3 lg:mb-0">
                <h1 className="font-bold mb-3">Product Thumbnail</h1>
                {fetchedData.imageURL ? (
                  <div className="bg-gray-100 py-5 rounded-lg text-center border-dashed border-2">
                    <div className="h-56">
                      <img
                        src={`${URL}/img/${fetchedData.imageURL}`}
                        alt="im"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <button
                      className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded"
                      onClick={() =>
                        setFetchedData({
                          ...fetchedData,
                          ["imageURL"]: "",
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <CustomSingleFileInput onChange={handleSingleImageInput} />
                )}
              </div>
              <div className="lg:w-2/3">
                <h1 className="font-bold">Product Information</h1>
                
                {/* Product Type Display (Read-only) */}
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-semibold text-blue-800">
                    Product Type: {productType === "simple" ? "Simple Product" : "Variable Product (Multi-Attribute)"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {productType === "simple" 
                      ? "This product has a single price and stock quantity."
                      : "This product has multiple variants with different prices and stock."}
                  </p>
                </div>

                <p className="admin-label">Title</p>
                <input
                  type="text"
                  placeholder="Type product name here"
                  className="admin-input"
                  name="name"
                  value={fetchedData.name || ""}
                  onChange={handleInputChange}
                />
                <p className="admin-label">Description</p>
                <textarea
                  name="description"
                  id="description"
                  className="admin-input h-36"
                  placeholder="Type product description here..."
                  value={fetchedData.description || ""}
                  onChange={handleInputChange}
                ></textarea>
                
                {/* Show quantity only for simple products */}
                {productType === "simple" && (
                  <>
                    <p className="admin-label">Quantity</p>
                    <input
                      type="number"
                      name="stockQuantity"
                      placeholder="Type product quantity here"
                      className="admin-input"
                      value={fetchedData.stockQuantity || ""}
                      onChange={handleInputChange}
                    />
                  </>
                )}
                
                {/* Show total stock for variable products (read-only) */}
                {productType === "variable" && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-semibold">Total Stock: {fetchedData.attributes.reduce((sum, attr) => sum + parseInt(attr.quantity || 0), 0)} units</p>
                    <p className="text-xs text-gray-600">Calculated from all variants</p>
                  </div>
                )}
              </div>
            </div>
            {/* Image Uploading */}
            <div className="admin-div">
              <h1 className="font-bold">Product Images</h1>
              {fetchedData.moreImageURL &&
              fetchedData.moreImageURL.length > 0 ? (
                <div className="bg-gray-100 py-5 rounded-lg text-center border-dashed border-2">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {fetchedData.moreImageURL.map((img, index) => (
                      <div
                        className="bg-white p-2 rounded-lg shadow-lg mb-2 w-28 h-28 relative"
                        key={index}
                      >
                        <img
                          src={`${URL}/img/${img}`}
                          alt="img"
                          className="h-full w-full object-contain"
                        />
                        <button
                          onClick={() => deleteOneProductImage(index)}
                          className="absolute -top-2 -right-2 text-xl p-2 bg-blue-100 hover:bg-blue-200 rounded-full"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded"
                    onClick={() =>
                      setFetchedData({
                        ...fetchedData,
                        ["moreImageURL"]: [],
                      })
                    }
                  >
                    Delete All
                  </button>
                </div>
              ) : (
                <>
                  <p className="admin-label my-2">Drop Here</p>
                  <CustomFileInput onChange={handleMultipleImageInput} />
                </>
              )}
            </div>
            {/* Add Additional Images */}
            <div className="admin-div">
              <h1 className="font-bold">Add Additional Images</h1>
              <p className="admin-label my-2">
                Upload additional product images
              </p>
              <CustomFileInput onChange={handleMultipleImageInput} />
            </div>
            {/* Attributes/Variants */}
            {productType === "variable" ? (
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
                      className="border rounded-lg p-4 bg-gray-50 mb-4"
                      onSubmit={handleAddVariant}
                    >
                      <h2 className="font-semibold mb-3">Add Variant Combination</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
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

                {/* Existing Variants Table */}
                <table className="border rounded-lg w-full min-w-max">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-2 text-left">Variant</th>
                      <th className="px-2 py-2 text-left">Price</th>
                      <th className="px-2 py-2 text-left">Quantity</th>
                      <th className="px-2 py-2 text-left">Markup (%)</th>
                      <th className="px-2 py-2 text-left">Image</th>
                      <th className="px-2 py-2 text-left">Highlight</th>
                      <th className="px-2 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchedData.attributes.map((at, index) => {
                      // Parse combination to display individual attributes
                      let displayVariant = at.value;
                      if (at.combination) {
                        const parts = at.combination.split(',');
                        displayVariant = parts.map(part => {
                          const [type, value] = part.split(':');
                          return `${type}: ${value}`;
                        }).join(' | ');
                      }
                      
                      return (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-2 py-1">
                            <div className="text-sm font-medium text-gray-700">
                              {displayVariant}
                            </div>
                            {at.combination && (
                              <div className="text-xs text-gray-500 mt-1">
                                {at.combination}
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="admin-input-no-m w-24"
                              type="number"
                              value={at.price || ""}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="admin-input-no-m w-20"
                              type="number"
                              value={at.quantity || ""}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              min="0"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="admin-input-no-m w-20"
                              type="number"
                              value={at.markup || "0"}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "markup",
                                  e.target.value
                                )
                              }
                              min="0"
                              placeholder="%"
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="admin-input-no-m w-16"
                              type="text"
                              value={at.imageIndex || ""}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "imageIndex",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <input
                              className="w-4 h-4"
                              type="checkbox"
                              checked={at.isHighlight}
                              onChange={(e) => {
                                handleAttributeChange(
                                  index,
                                  "isHighlight",
                                  e.target.checked
                                );
                              }}
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <button
                              onClick={() => handleDeleteAttribute(index)}
                              className="text-xl text-red-500 hover:text-red-700"
                              type="button"
                            >
                              <AiOutlineDelete />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {fetchedData.attributes.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-sm font-semibold">Total Variants: {fetchedData.attributes.length}</p>
                    <p className="text-sm font-semibold">Total Stock: {fetchedData.attributes.reduce((sum, attr) => sum + parseInt(attr.quantity || 0), 0)} units</p>
                  </div>
                )}
              </div>
            ) : (
              // Simple Product Attributes
              <div className="admin-div">
                <h1 className="font-bold">Product Attributes (Optional)</h1>
                <p className="text-xs text-gray-600 mb-3">Add optional attributes like warranty, color, etc.</p>
                
                {/* Add New Attribute Form */}
                <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                  <h2 className="font-semibold mb-3">Add New Attribute</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Attribute Name</label>
                      <input
                        type="text"
                        className="admin-input-no-m"
                        placeholder="e.g., Warranty, Color"
                        value={attributeName}
                        onChange={(e) => setAttributeName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Attribute Value</label>
                      <input
                        type="text"
                        className="admin-input-no-m"
                        placeholder="e.g., 1 Year, Black"
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="admin-button-fl bg-blue-700 text-white"
                  >
                    <AiOutlineAppstoreAdd className="mr-2" />
                    Add Attribute
                  </button>
                </div>

                {/* Existing Attributes Table */}
                {fetchedData.attributes.length > 0 && (
                  <table className="border rounded-lg w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-2 text-left">Name</th>
                        <th className="px-2 py-2 text-left">Value</th>
                        <th className="px-2 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchedData.attributes.map((at, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="px-2 py-1">
                            <input
                              className="admin-input-no-m w-full"
                              type="text"
                              value={at.name}
                              onChange={(e) =>
                                handleAttributeChange(index, "name", e.target.value)
                              }
                            />
                          </td>
                          <td className="px-2 py-1">
                            <input
                              className="admin-input-no-m w-full"
                              type="text"
                              value={at.value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="px-2 py-1 text-center">
                            <button
                              onClick={() => handleDeleteAttribute(index)}
                              className="text-xl text-red-500 hover:text-red-700"
                              type="button"
                            >
                              <AiOutlineDelete />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
          {/* Pricing */}
          <div className="lg:w-2/6">
            {/* Pricing - Only for Simple Products */}
            {productType === "simple" && (
              <div className="admin-div">
                <h1 className="font-bold">Product Pricing</h1>
                <p className="admin-label">Amount *</p>
                <input
                  type="number"
                  name="price"
                  placeholder="Type product price here"
                  className="admin-input"
                  value={fetchedData.price || ""}
                  onChange={handleInputChange}
                />
                <p className="admin-label">Markup (%)</p>
                <input
                  type="number"
                  name="markup"
                  placeholder="Type product markup here"
                  className="admin-input"
                  value={fetchedData.markup || ""}
                  onChange={handleInputChange}
                  min="0"
                  max="1000"
                />
              </div>
            )}
            
            {/* Variant Pricing Info for Variable Products */}
            {productType === "variable" && (
              <div className="admin-div">
                <h1 className="font-bold">Variant Pricing</h1>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-semibold">Base Price: ${fetchedData.attributes.length > 0 ? Math.min(...fetchedData.attributes.map(attr => parseFloat(attr.price || 0))) : 0}</p>
                  <p className="text-xs text-gray-600 mt-1">Lowest variant price (auto-calculated)</p>
                  <p className="text-sm font-semibold mt-2">Price Range: ${fetchedData.attributes.length > 0 ? Math.min(...fetchedData.attributes.map(attr => parseFloat(attr.price || 0))) : 0} - ${fetchedData.attributes.length > 0 ? Math.max(...fetchedData.attributes.map(attr => parseFloat(attr.price || 0))) : 0}</p>
                </div>
              </div>
            )}
            
            {/* Offer Section */}
            <div className="admin-div">
              <h1 className="font-bold">Product Offer</h1>
              <p className="admin-label">Offer Discount (%)</p>
              <input
                type="number"
                name="offer"
                placeholder="Type product offer here"
                className="admin-input"
                value={fetchedData.offer || ""}
                min={0}
                max={100}
                onChange={handleInputChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                {productType === "simple" 
                  ? "This discount will apply to the product price" 
                  : "This discount will apply to all variants"}
              </p>
            </div>
            <div className="admin-div">
              <h1 className="font-bold">Category</h1>
              <p className="admin-label">Product Category</p>
              <select
                name="category"
                id="categories"
                className="admin-input"
                value={fetchedData.category || ""}
                onChange={handleInputChange}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-div">
              <h1 className="font-bold">Product Status</h1>
              <p className="admin-label">Status</p>
              <select
                name="status"
                id="status"
                className="admin-input capitalize"
                value={fetchedData.status || ""}
                onChange={handleInputChange}
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

export default EditProduct;
