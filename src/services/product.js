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

export const apiGetScheduledProducts = async () => {
  return apiClient.get("/history");
};
export const apiGetUsersScheduledProducts = async () => {
  return apiClient.get("/users/me/schedules");
};
export const apiGetVendorsProducts = async () => {
  return apiClient.get("/users/me/products");
};
export const apiGetScheduledCounts = async () => {
  return apiClient.get("/schedules/count/");
};
export const apiGetSingleScheduledProducts = async (id) => {
  return apiClient.get(`/schedule/${id}`);
};
export const apiGetProfile = async () => {
  return apiClient.get("/users/profile");
};
export const apiSendMessage = async (messageData) => {
  return apiClient.post("/send", messageData);
};
export const apiEditProduct = async (id, formData) => {
  return apiClient.patch(`schedules/${id}`, formData);
};
export const apiEditScheduledProduct = async (id, formData) => {
  return apiClient.patch(`/${id}/status`, formData);
};
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
export const apiEditRecycledProduct = async (id, formData) => {
  return apiClient.patch(`/products/${id}`, formData);
};
export const apiDeleteScheduledTicket = async (id) => {
  return apiClient.delete(`/schedules/${id}`);
};
export const apiDeleteTicket = async (id) => {
  return apiClient.delete(`/products/${id}`);
};