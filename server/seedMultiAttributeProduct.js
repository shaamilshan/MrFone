const mongoose = require("mongoose");
const Product = require("./model/productModel");
const Category = require("./model/categoryModel");
require('dotenv').config();

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGO_URI;

const seedProduct = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get first category to use
    const category = await Category.findOne();
    if (!category) {
      console.log("No categories found. Please create a category first.");
      process.exit(1);
    }

    console.log("Using category:", category.name);

    // Create a multi-attribute product
    const product = new Product({
      name: "iPhone 15 Pro - Multi Variant",
      description: "Latest iPhone with advanced features. Available in multiple colors and storage options.",
      category: category._id,
      imageURL: "default-phone.jpg", // Update with actual image
      price: 45999, // Base price (will be calculated from variants)
      markup: 0,
      stockQuantity: 50, // Total stock (will be calculated from variants)
      status: "published",
      offer: 10,
      moreImageURL: ["default-phone.jpg"],
      attributes: [
        // Black + 128GB
        {
          name: "Color",
          value: "Black + 128GB",
          combination: "Color:Black,Storage:128GB",
          price: 45999,
          markup: 0,
          quantity: 10,
          imageIndex: 1,
          isHighlight: false
        },
        // Black + 256GB
        {
          name: "Color",
          value: "Black + 256GB",
          combination: "Color:Black,Storage:256GB",
          price: 55999,
          markup: 0,
          quantity: 8,
          imageIndex: 1,
          isHighlight: true
        },
        // Black + 512GB
        {
          name: "Color",
          value: "Black + 512GB",
          combination: "Color:Black,Storage:512GB",
          price: 65999,
          markup: 0,
          quantity: 5,
          imageIndex: 1,
          isHighlight: false
        },
        // Blue + 128GB
        {
          name: "Color",
          value: "Blue + 128GB",
          combination: "Color:Blue,Storage:128GB",
          price: 45999,
          markup: 0,
          quantity: 12,
          imageIndex: 2,
          isHighlight: false
        },
        // Blue + 256GB
        {
          name: "Color",
          value: "Blue + 256GB",
          combination: "Color:Blue,Storage:256GB",
          price: 55999,
          markup: 0,
          quantity: 7,
          imageIndex: 2,
          isHighlight: false
        },
        // Blue + 512GB - OUT OF STOCK
        {
          name: "Color",
          value: "Blue + 512GB",
          combination: "Color:Blue,Storage:512GB",
          price: 65999,
          markup: 0,
          quantity: 0,
          imageIndex: 2,
          isHighlight: false
        },
        // Silver + 256GB
        {
          name: "Color",
          value: "Silver + 256GB",
          combination: "Color:Silver,Storage:256GB",
          price: 55999,
          markup: 0,
          quantity: 8,
          imageIndex: 3,
          isHighlight: false
        }
      ]
    });

    await product.save();
    console.log("\n✅ Multi-attribute product created successfully!");
    console.log("Product ID:", product._id);
    console.log("Product Name:", product.name);
    console.log("Total Variants:", product.attributes.length);
    console.log("\nVariants created:");
    product.attributes.forEach((attr, index) => {
      console.log(`${index + 1}. ${attr.combination} - ₹${attr.price} - Stock: ${attr.quantity}`);
    });

    console.log("\n🎉 You can now view this product in the frontend!");
    console.log(`Product ID to test: ${product._id}`);

  } catch (error) {
    console.error("Error seeding product:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  }
};

seedProduct();
