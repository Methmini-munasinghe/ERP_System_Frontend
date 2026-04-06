import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import purchaseOrderReducer from "../features/slices/purchaseOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    purchaseOrder: purchaseOrderReducer,
  },
});