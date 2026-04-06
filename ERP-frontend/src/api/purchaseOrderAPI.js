import axiosClient from "../services/axiosClient";

export const purchaseOrderAPI = {
  getAll: () => axiosClient.get("/purchase-orders"),

  create: (formData) =>
    axiosClient.post("/purchase-orders", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateStatus: (id, status) =>
    axiosClient.put(`/purchase-orders/${id}`, { status }),

  cancel: (id) => axiosClient.put(`/purchase-orders/cancel/${id}`),
};
