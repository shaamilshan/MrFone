import { createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct,
  updateProduct,
} from "../../actions/admin/productActions";

const productSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    products: [],
    error: null,
    totalAvailableProducts: null,
  },
  extraReducers: (builder) => {
    builder
      // Getting Product details
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.products = payload.products;
        state.totalAvailableProducts = payload.totalAvailableProducts;
      })
      .addCase(getProducts.rejected, (state, { payload }) => {
        state.loading = false;
        state.products = null;
        state.error = payload;
      })

      // Creating new Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        if (payload && payload.product) {
          state.products = [...state.products, payload.product];
          state.totalAvailableProducts = (state.totalAvailableProducts || 0) + 1;
        }
      })
      .addCase(createProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Updating a product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        const product = payload.product || payload;
        const index = state.products.findIndex(
          (p) => p._id === product._id
        );

        if (index !== -1) {
          state.products[index] = product;
        }
      })
      .addCase(updateProduct.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default productSlice.reducer;
