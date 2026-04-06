import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { purchaseOrderAPI } from "../../api/purchaseOrderAPI";

export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrder/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await purchaseOrderAPI.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  "purchaseOrder/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await purchaseOrderAPI.create(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create order");
    }
  }
);

export const updatePurchaseOrderStatus = createAsyncThunk(
  "purchaseOrder/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await purchaseOrderAPI.updateStatus(id, status);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

export const cancelPurchaseOrder = createAsyncThunk(
  "purchaseOrder/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const res = await purchaseOrderAPI.cancel(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel order");
    }
  }
);

const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
      .addCase(cancelPurchaseOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      });
  },
});

export default purchaseOrderSlice.reducer;
