import { apiClient } from "./config";

// Get education/awareness resources, optionally filtered by category
export const apiGetEducationResources = async (category) => {
  return apiClient.get("/education", { params: category ? { category } : {} });
};

// Get a single resource
export const apiGetEducationResource = async (id) => {
  return apiClient.get(`/education/${id}`);
};

// Add a resource (admin only)
export const apiAddEducationResource = async (formData) => {
  return apiClient.post("/education", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Update a resource (admin only)
export const apiUpdateEducationResource = async (id, formData) => {
  return apiClient.patch(`/education/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete a resource (admin only)
export const apiDeleteEducationResource = async (id) => {
  return apiClient.delete(`/education/${id}`);
};
