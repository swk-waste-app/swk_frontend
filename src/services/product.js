import { apiClient } from "./config";

// Get all products
export const apiGetProducts = async () => {
  return apiClient.get("/products");
};

// Add product
export const apiAddProducts = async (formData) => {
  return apiClient.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Add schedule
export const apiAddSchedule = async (formData) => {
  return apiClient.post("/waste-collection/schedule", formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Get all scheduled products
export const apiGetScheduledProducts = async () => {
  return apiClient.get("/waste-collection/history");
};

// Get user's scheduled products
export const apiGetUsersScheduledProducts = async () => {
  return apiClient.get("/users/me/schedules");
};

// Get vendor's products
export const apiGetVendorsProducts = async () => {
  return apiClient.get("/users/me/products");
};

// Get scheduled counts
export const apiGetScheduledCounts = async () => {
  return apiClient.get("/waste-collection/schedules/count");
};

// Get single scheduled product
export const apiGetSingleScheduledProducts = async (id) => {
  return apiClient.get(`/waste-collection/schedule/${id}`);
};

// Get profile
export const apiGetProfile = async () => {
  return apiClient.get("/users/profile");
};

// Send message
export const apiSendMessage = async (messageData) => {
  return apiClient.post("/messages/send", messageData);
};

// Edit schedule
export const apiEditProduct = async (id, formData) => {
  return apiClient.patch(`/waste-collection/schedules/${id}`, formData);
};

// Edit scheduled product status
export const apiEditScheduledProduct = async (id, formData) => {
  return apiClient.patch(`/waste-collection/${id}/status`, formData);
};

// Get single product
export const apiGetSingleProduct = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 404: throw new Error('Product not found');
        case 401: throw new Error('Unauthorized access');
        case 403: throw new Error('Forbidden access');
        default: throw new Error('Failed to fetch product details');
      }
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error('Error setting up request');
    }
  }
};

// Edit recycled product
export const apiEditRecycledProduct = async (id, formData) => {
  return apiClient.patch(`/products/${id}`, formData);
};

// Delete scheduled ticket
export const apiDeleteScheduledTicket = async (id) => {
  return apiClient.delete(`/waste-collection/schedules/${id}`);
};

// Delete product
export const apiDeleteTicket = async (id) => {
  return apiClient.delete(`/products/${id}`);
};

// Get user stats
export const apiGetUserStats = async () => {
  return apiClient.get("/users/me/stats");
};

// Get leaderboard
export const apiGetLeaderboard = async () => {
  return apiClient.get("/users/leaderboard");
};

// Submit rating and feedback for a completed pickup
export const apiSubmitPickupRating = async (id, data) => {
  return apiClient.patch(`/waste-collection/schedules/${id}`, data);
};

// Get public vendor profile
export const apiGetVendorProfile = async (vendorId) => {
  return apiClient.get(`/users/${vendorId}/public`);
};

// Get a vendor's public products
export const apiGetVendorProducts = async (vendorId) => {
  return apiClient.get(`/products?user=${vendorId}`);
};